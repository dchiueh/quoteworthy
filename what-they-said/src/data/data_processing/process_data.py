import re
import html
import json
import pandas as pd
from quote_parser import QuoteParser

DATA_FILEPATH = "./nyt_2020_mini.csv"
PARSED_FILEPATH = "./nyt_2020_mini_html_parsed.csv"
JSON_FILEPATH = "../nyt_2020_mini.json"

qp = QuoteParser()

def parse_data_into_html_encoding():
	with open(DATA_FILEPATH, 'r') as f, open(PARSED_FILEPATH, 'w') as g:
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
	return { "articles": articles }

def create_object(df_row, tokenized_document, attribution_quote_map):
	attributions = list(attribution_quote_map.keys())
	# assert "“" in tokenized_document and "”" in tokenized_document, "Warning: this article contains no quotes"
	row_obj = {
		"title": safe_get_from_row(df_row["title"]),
		"publish_date": reformat_date_string(df_row["publish_date"]),
		"url": df_row["url"],
		"author": safe_get_from_row(df_row["author"]),
		"abstract": safe_get_from_row(df_row["abstract"]),
		"slug": safe_get_from_row(df_row["slug"]),
		"section": safe_get_from_row(df_row["section_display"]),
		"people": parse_double_pipe_delimited_string(df_row["people"]),
		"keywords": parse_double_pipe_delimited_string(df_row["keywords"]),
		"location": parse_article_for_location(df_row["paragraphs"]),
		"attributions": attributions,
		"original_text": df_row["paragraphs"],
		"tokenized_text": tokenized_document,
		"quotes_by_attribution": [ { "attribution": attr, "quotes": quotes } for attr, quotes in attribution_quote_map.items()],
	}
	return row_obj

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
	location_pattern = r' \b[A-Z]+(?:\s+[A-Z]+)*\b —'
	match = re.search(location_pattern, article_str)
	if match:
		return match.group(0)[1:-2]
	else:
		return None


if __name__ == "__main__":
	parse_data_into_html_encoding()
	df = pd.read_csv(PARSED_FILEPATH)
	data_object = parse_data_into_json(df)
	with open(JSON_FILEPATH, "w") as f:
		json.dump(data_object, f, ensure_ascii=False, indent=2)
	