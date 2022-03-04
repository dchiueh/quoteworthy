from allennlp.predictors.predictor import Predictor
import allennlp_models.tagging
import spacy
import re

COREF_MODEL_URL = "https://storage.googleapis.com/allennlp-public-models/coref-spanbert-large-2021.03.10.tar.gz"
ACTION_VERBS = ["added", "said", "asked", "called", "denounced", "told", "objected", "wrote"]
# TODO: add "joked", "quipped"
LOOK_AROUND_SIZE = 30

coref_predictor = Predictor.from_path(COREF_MODEL_URL)
named_entity_model = spacy.load('en_core_web_sm')

class QuoteParser:
    # public methods
    def __init__(self):
        print("\nCreating QuoteParser... this may take a bit.")
        print("You can ignore any messages about weight initialization below")
        self.coref_predictor = coref_predictor
        self.named_entity_model = named_entity_model
        print("Created -- ready to parse!\n")

    def parse_text(self, text):
        assert isinstance(text, str), f"Error: can't process -- the input text is not a string"
        entity_doc = self.named_entity_model(text)
        tokenized_document = self.get_tokenized_document(entity_doc)
        quote_indices = self.identify_valid_quotes(tokenized_document)
        coreferences = self.coref_predictor.predict(text)
        index_to_entity = self.map_index_to_entity(entity_doc, coreferences, quote_indices, tokenized_document)
        quotes_and_attributions = self.assign_quotes_to_attributions(tokenized_document, index_to_entity, quote_indices)
        attribution_quote_map = self.organize_quotes_by_attribution(quotes_and_attributions)
        return [token.text for token in tokenized_document], attribution_quote_map

    # private methods
    def get_tokenized_document(self, entity_document):
        tokenized_document = []
        for token in entity_document:
            if re.match(r'PHOTO', token.text):
                break
            tokenized_document.append(token)
        return tokenized_document
    
    def identify_valid_quotes(self, tokenized_document):
        quote_indices = []
        start_quote_indices = [idx for idx, token in enumerate(tokenized_document) if token.text == "“"]
        end_quote_indices = [idx for idx, token in enumerate(tokenized_document) if token.text == "”"]
        # check that every quotation mark has a matching pair
        assert len(start_quote_indices) == len(end_quote_indices), f"Warning: the number of start and end quotation marks don't match! ({len(start_quote_indices)} to {len(end_quote_indices)})"
        for start_idx, end_idx in zip(start_quote_indices, end_quote_indices):
            assert start_idx < end_idx, f"Warning: mismatched start and end quotation marks (start index {start_idx} + end index {end_idx})"
            token_sentence = tokenized_document[start_idx+1:end_idx]
            num_valid_tokens = sum(1 for token in token_sentence if not re.fullmatch(r'[^\w]', token.text))
            if num_valid_tokens >= 3:
                quote_indices.append((start_idx, end_idx))
        return quote_indices

    def map_index_to_entity(self, entity_doc, coreferences, quote_indices, tokenized_document):
        index_to_entity = {}
        for entity in entity_doc.ents:
            if entity.label_ == "PERSON":
                if entity.start >= len(tokenized_document):
                    continue
                if self.entity_between_quotes(quote_indices, entity):
                    continue
                coreference_overlap = self.get_coreference_overlap(coreferences, entity.start, entity.end)
                if coreference_overlap is not None:
                    index_to_entity = self.add_entity_to_span(index_to_entity, coreference_overlap, entity.text)
                else:
                    single_reference_span = [[entity.start, entity.end-1]]
                    index_to_entity = self.add_entity_to_span(index_to_entity, single_reference_span, entity.text)
        return index_to_entity

    def entity_between_quotes(self, quote_indices, entity):
        for start_quote, end_quote in quote_indices:
            if entity.start > start_quote and entity.end < end_quote:
                return True
        return False
    
    def get_coreference_overlap(self, coreferences, ent_start_idx, ent_end_idx):
        for reference_cluster in coreferences["clusters"]:
            for span in reference_cluster:
                if ent_start_idx >= span[0] and ent_start_idx <= span[1]:
                    return reference_cluster
                if ent_end_idx > span[0] and ent_end_idx <= span[1]+1:
                    return reference_cluster
        return None

    def add_entity_to_span(self, index_to_entity, coref_spans, entity):
        if entity[-2:] == "’s":
            entity = entity[:-2]
        for span in coref_spans:
            for idx in range(span[0], span[1]+1):
                if idx in index_to_entity:
                    index_to_entity[idx].add(entity)
                else:
                    index_to_entity[idx] = { entity }
        return index_to_entity

    def assign_quotes_to_attributions(self, tokenized_document, index_to_entity, quote_indices):
        entity_memo = {}
        quotes_and_attributions = []
        for start_idx, end_idx in quote_indices:
            attribution, attr_index, pattern_type = self.assign_attribution(tokenized_document, index_to_entity, start_idx, end_idx)
            if attribution is not None:
                quote_tokens = tokenized_document[start_idx+1:end_idx]
                named_entity = self.get_likely_entity(entity_memo, attribution)
                original_quote = "".join(token.text_with_ws for token in quote_tokens)
                quote_context = self.get_quote_context(quote_tokens, original_quote)
                attr_obj = {
                    "quote": original_quote,
                    "context": quote_context,
                    "named_attribution": named_entity,
                    "start_quote_index": start_idx,
                    "end_quote_index": end_idx,
                    "attribution_index": attr_index,
                    "attribution_method": pattern_type,
                }
                quotes_and_attributions.append(attr_obj)
        return quotes_and_attributions

    def assign_attribution(self, tokenized_document, index_to_entity, quote_start_idx, quote_end_idx):
        # pattern 1 - if entity->verb is immediately after the quote (ex: "[...]," he said)
        if tokenized_document[quote_end_idx-1].text in [",", "?"] and quote_end_idx+1 in index_to_entity:
            scan_idx = quote_end_idx + 2
            while scan_idx in index_to_entity:
                scan_idx += 1
                if tokenized_document[scan_idx].text in ACTION_VERBS:
                    attr_idx = quote_end_idx + 1
                    entity = index_to_entity[attr_idx]
                    return entity, attr_idx, 'pattern_1'
        # pattern 2 - if verb->entity is immediately after the quote (ex: "[...]," said Newsom)
        if tokenized_document[quote_end_idx-1].text in [",", "?"] and quote_end_idx+1 < len(tokenized_document) and tokenized_document[quote_end_idx+1].text in ACTION_VERBS:
            scan_idx = quote_end_idx + 2
            while scan_idx not in index_to_entity:
                scan_idx += 1
            return index_to_entity[scan_idx], scan_idx, 'pattern_2'
        # pattern 3 - if entity->verb is before the quote (ex: He said to reporters "[...]")
        encountered_action_verb = False
        num_unclosed_quotes = 0
        for idx in reversed(range(quote_start_idx-LOOK_AROUND_SIZE, quote_start_idx)):
            if tokenized_document[idx].text == "”":
                num_unclosed_quotes += 1
            elif tokenized_document[idx].text == "“":
                num_unclosed_quotes -= 1
            if num_unclosed_quotes == 0:
                if tokenized_document[idx].text in ACTION_VERBS:
                    encountered_action_verb = True
                elif encountered_action_verb and idx in index_to_entity:
                    return index_to_entity[idx], idx, 'pattern_3'
        # pattern 4 - if verb->entity is before the quote (ex: "lorem ipsum," said Newsom to reporters. "[...]")
        if tokenized_document[quote_start_idx-1].text == ".":
            entity_idx = None
            for idx in reversed(range(quote_start_idx-LOOK_AROUND_SIZE, quote_start_idx)):
                if idx in index_to_entity:
                    entity_idx = idx
                elif entity_idx is not None and tokenized_document[idx].text == "”" and tokenized_document[idx-1].text == ",":
                    return index_to_entity[entity_idx], entity_idx, 'pattern_4'
        # default - proximity assignment
        for diff in range(LOOK_AROUND_SIZE):
            pre_quote_idx = quote_start_idx - diff - 1
            post_quote_idx = quote_end_idx + diff + 2
            if pre_quote_idx in index_to_entity:
                return index_to_entity[pre_quote_idx], pre_quote_idx, 'proximity'
            elif post_quote_idx in index_to_entity:
                return index_to_entity[post_quote_idx], post_quote_idx, 'proximity'
        return None, None, None
    
    def get_likely_entity(self, entity_memo, attribution_set):
        possible_attributions = frozenset(attribution_set)
        if possible_attributions not in entity_memo:
            longest_name = max(possible_attributions, key=lambda x: len(x))
            entity_memo[possible_attributions] = longest_name
        return entity_memo[possible_attributions]
    
    def get_quote_context(self, quote_tokens, original_quote):
        if original_quote[0].isupper() and original_quote[-1] in [",", ".", "?", "'"]:
            return None
        return quote_tokens[0].sent.text
    
    def organize_quotes_by_attribution(self, quotes_and_attributions):
        attribution_quote_map = {}
        for quote_obj in quotes_and_attributions:
            named_attribution = quote_obj.pop("named_attribution")
            if named_attribution in attribution_quote_map:
                attribution_quote_map[named_attribution].append(quote_obj)
            else:
                attribution_quote_map[named_attribution] = [quote_obj]
        return attribution_quote_map