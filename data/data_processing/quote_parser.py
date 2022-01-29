from allennlp.predictors.predictor import Predictor
import allennlp_models.tagging
import spacy

COREF_MODEL_URL = "https://storage.googleapis.com/allennlp-public-models/coref-spanbert-large-2021.03.10.tar.gz"
QUOTE_PERCEPTIVE_FIELD = 12
QUOTE_WINDOW_SIZE = 3

class QuoteParser:
	# public methods
	def __init__(self):
		print("Creating QuoteParser... this may take a bit.")
		print("You can ignore any message about weight initialization below")
		self.coref_predictor = Predictor.from_path(COREF_MODEL_URL)
		self.named_entity_model = spacy.load('en_core_web_sm')
		print("Created -- ready to parse!\n")

	def parse_text(self, text):
		assert isinstance(text, str), f"Error: can't process -- the input text is not a string"
		if not isinstance(text, str):
			raise Exception("Error: ")
		entity_doc = self.named_entity_model(text)
		coreferences = self.coref_predictor.predict(text)
		tokenized_document = coreferences["document"]
		index_to_entity = self.map_index_to_entity(entity_doc, coreferences)
		quotes_and_attributions = self.assign_quotes_to_attributions(tokenized_document, index_to_entity)
		return tokenized_document, quotes_and_attributions

	def map_index_to_entity(self, entity_doc, coreferences):
		index_to_entity = {}
		for entity in entity_doc.ents:
			if entity.label_ == "PERSON":
				coreference_overlap = self.get_coreference_overlap(coreferences, entity.start, entity.end)
				if coreference_overlap is not None:
					index_to_entity = self.add_entity_to_span(index_to_entity, coreference_overlap, entity.text)
				else:
					single_reference_span = [[entity.start, entity.end-1]]
					index_to_entity = self.add_entity_to_span(index_to_entity, single_reference_span, entity.text)
		return index_to_entity

	# private methods
	def get_coreference_overlap(self, coreferences, ent_start_idx, ent_end_idx):
		for reference_cluster in coreferences["clusters"]:
			for span in reference_cluster:
				if ent_start_idx >= span[0] and ent_start_idx <= span[1]:
					return reference_cluster
				if ent_end_idx > span[0] and ent_end_idx <= span[1]+1:
					return reference_cluster
		return None

	def add_entity_to_span(self, index_to_entity, coref_spans, entity):
		for span in coref_spans:
			for idx in range(span[0], span[1]+1):
				if idx in index_to_entity:
					index_to_entity[idx].add(entity)
				else:
					index_to_entity[idx] = { entity }
		return index_to_entity

	def assign_quotes_to_attributions(self, tokenized_document, index_to_entity):
		quotes_and_attributions = []
		start_quote_indices = [idx for idx, token in enumerate(tokenized_document) if token == "“"]
		end_quote_indices = [idx for idx, token in enumerate(tokenized_document) if token == "”"]
		# check that every quotation mark has a matching pair
		assert len(start_quote_indices) == len(end_quote_indices), f"Warning: the number of start and end quotation marks don't match! ({len(start_quote_indices)} to {len(end_quote_indices)})"
		for start_idx, end_idx in zip(start_quote_indices, end_quote_indices):
			attribution, attr_index = self.find_nearest_attribution(index_to_entity, start_idx, end_idx, QUOTE_WINDOW_SIZE)
			if attribution is not None:
				attr_obj = {
					"quote": " ".join(tokenized_document[start_idx+1:end_idx]),
					"named_attribution": list(attribution),
					"start_quote_index": start_idx,
					"end_quote_index": end_idx,
					"attribution_index": attr_index,
				}
				quotes_and_attributions.append(attr_obj)
		return quotes_and_attributions

	def find_nearest_attribution(self, index_to_entity, start_quote_index, end_quote_index, window_size):
		for chunk in range(1, QUOTE_PERCEPTIVE_FIELD, QUOTE_WINDOW_SIZE):
			for diff in range(chunk, chunk+QUOTE_WINDOW_SIZE):
				pre_quote_idx = start_quote_index - diff
				post_quote_idx = end_quote_index + diff
				if post_quote_idx in index_to_entity:
					return index_to_entity[post_quote_idx], post_quote_idx
				elif pre_quote_idx in index_to_entity:
					return index_to_entity[pre_quote_idx], pre_quote_idx
		return None, None


