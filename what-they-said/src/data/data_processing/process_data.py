import re
import html
import json
import pandas as pd
from quote_parser import QuoteParser

DATA_FILEPATH = "./nyt_2020_mini.csv"
PARSED_FILEPATH = "./nyt_2020_mini_html_parsed.csv"
JSON_FILEPATH = "../nyt_2020_mini.json"

qp = QuoteParser()

def parse_data_into_html_encoding(data_to_parse, save_filepath):
    with open(data_to_parse, 'r') as f, open(save_filepath, 'w') as g:
        content = html.unescape(f.read())
        g.write(content)

def parse_data_into_json(dataframe):
    articles = []
    for idx, row in dataframe.iterrows():
        print(f"Parsing article {idx+1} / {len(dataframe)}...")
        try:
            tokenized_document, attribution_quote_map = qp.parse_text(row["paragraphs"])
            row_obj = create_object(row, tokenized_document, attribution_quote_map)
            articles.append(row_obj)
        except AssertionError as err:
            print(f"Skipping article {idx+1} due to message: \"{err}\"")
    print("Merging named entities...")
    articles = merge_matching_entities_all_articles(articles)
    return { "articles": articles }

def create_object(df_row, tokenized_document, attribution_quote_map):
    people = parse_double_pipe_delimited_string(df_row["people"])
    attribution_quote_map = resolve_entities_within_article(attribution_quote_map, people)
    attributions = list(attribution_quote_map.keys())
    row_obj = {
        "title": safe_get_from_row(df_row["title"]),
        "publish_date": reformat_date_string(df_row["publish_date"]),
        "url": df_row["url"],
        "author": safe_get_from_row(df_row["author"]),
        "abstract": safe_get_from_row(df_row["abstract"]),
        "slug": safe_get_from_row(df_row["slug"]),
        "section": safe_get_from_row(df_row["section_display"]),
        "people": people,
        "keywords": parse_double_pipe_delimited_string(df_row["keywords"]),
        "location": parse_article_for_location(df_row["paragraphs"]),
        "attributions": attributions,
        "quotes_by_attribution": [ { "attribution": attr, "quotes": quotes } for attr, quotes in attribution_quote_map.items()],
    }
    return row_obj

def resolve_entities_within_article(attribution_quote_map, people):
    entities_to_merge = get_entities_to_merge_within_article(attribution_quote_map, people)
    for entity, match in entities_to_merge.items():
        quotes = attribution_quote_map.pop(entity)
        for quote_obj in quotes:
            quote_obj['original_attribution'] = entity
        attribution_quote_map[match].extend(quotes)
        attribution_quote_map[match].sort(key=lambda obj: obj['start_quote_index'])
    return attribution_quote_map

def get_entities_to_merge_within_article(attribution_quote_map, people):
    entities_to_convert = {}
    people_as_entities = convert_people_to_entities(people) - attribution_quote_map.keys()
    for attr in attribution_quote_map.keys():
        matching_person = find_matching_entity_name(people_as_entities, attr)
        if matching_person:
            entities_to_convert[attr] = matching_person
    for old_entity, new_entity in entities_to_convert.items():
        attribution_quote_map[new_entity] = attribution_quote_map.pop(old_entity)
    entities_to_merge = {}
    for attr in attribution_quote_map.keys():
        matching_entity = find_matching_entity_name(attribution_quote_map.keys(), attr)
        if matching_entity:
            entities_to_merge[attr] = matching_entity
    return entities_to_merge

def convert_people_to_entities(people):
    entities = set()
    for person in people:
        person = re.sub(r" \([^()]*\)", "", person)
        comma_split = person.split(", ")
        if len(comma_split) == 1:
            entities.add(person)
        elif comma_split[1][-1] == "-":
            entities.add(comma_split[1] + comma_split[0])
        else:
            tokens = [token + "." if len(token) == 1 and re.match(r"[A-Z]", token) else token for token in comma_split[1].split(" ")]
            tokens = [token + "." if token == "Jr" or token == "Sr" else token for token in tokens]
            if tokens[-1] == "Jr." or tokens[-1] == "Sr." or tokens[-1] == "III":
                name = " ".join(tokens[:-1]) + " " + comma_split[0] + " " + tokens[-1]
                entities.add(name)
            else:
                name = " ".join(tokens) + " " + comma_split[0]
                entities.add(name)
    return entities

def safe_get_from_row(df_value):
    return None if pd.isna(df_value) else df_value

def reformat_date_string(date_str):
    return date_str[:4] + "-" + date_str[4:6] + "-" + date_str[6:8]

def parse_double_pipe_delimited_string(delimited_str):
    if pd.isna(delimited_str):
        return []
    else:
        return delimited_str.split(" || ")

def parse_article_for_location(article_str):
    location_pattern = r'\b[A-Z]+(?:\s+[A-Z]+)*\b —'
    match = re.search(location_pattern, article_str)
    if match:
        return match.group(0)[0:-2]
    else:
        return None

def merge_matching_entities_all_articles(articles):
    entities_to_merge = get_entities_to_merge_all_articles(articles)
    for article_obj in articles:
        for idx, attr in enumerate(article_obj['attributions']):
            if attr in entities_to_merge:
                article_obj['attributions'][idx] = entities_to_merge[attr]
        for quote_attr_obj in article_obj['quotes_by_attribution']:
            attr = quote_attr_obj['attribution']
            if attr in entities_to_merge:
                for quote_obj in quote_attr_obj['quotes']:
                    quote_obj['original_attribution'] = attr
                quote_attr_obj['attribution'] = entities_to_merge[attr]
    return articles

def get_entities_to_merge_all_articles(articles):
    entities = {}
    entities_to_merge = {}
    for article_obj in articles:
        attributions = [attr_obj['attribution'] for attr_obj in article_obj['quotes_by_attribution']]
        for entity in attributions:
            entities[entity] = entities.get(entity, 0) + 1
    entities = [entity for entity, count in sorted(entities.items(), key=lambda x: -x[1])]
    for entity in entities:
        match = find_matching_entity_name(entities, entity)
        if match:
            entities_to_merge[entity] = match
    return entities_to_merge

def find_matching_entity_name(candidates, entity_name):
    for other_attr in candidates:
        if entity_name != other_attr and entity_name in other_attr.split():
                return other_attr
    return None


if __name__ == "__main__":
    parse_data_into_html_encoding(DATA_FILEPATH, PARSED_FILEPATH)
    df = pd.read_csv(PARSED_FILEPATH)
    data_object = parse_data_into_json(df)
    with open(JSON_FILEPATH, "w") as f:
        json.dump(data_object, f, ensure_ascii=False, indent=2)
    