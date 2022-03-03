import json

COMPUTED_DATA_FILEPATH = "../nyt_2020_mini.json"
LABEL_DATA_FILEPATH = "./mini_labels.json"
METRIC_SAVE_FILEPATH = "./metrics.json"
NUM_SIG_FIGS = 3

with open(COMPUTED_DATA_FILEPATH, "r") as f:
    PREDICTED_DATA = json.load(f)

with open(LABEL_DATA_FILEPATH, "r") as f:
    TRUE_LABELS = json.load(f)

def report_quote_metrics():
    true_quotes = get_all_quotes(TRUE_LABELS)
    detected_quotes = get_all_quotes(PREDICTED_DATA)
    return compute_metrics(true_quotes, detected_quotes)

def report_entity_metrics():
    true_entities = get_all_entities(TRUE_LABELS)
    attributed_entities = get_all_entities(PREDICTED_DATA)
    return compute_metrics(true_entities, attributed_entities)
    
def report_attribution_metrics():
    true_attributions = get_all_attributions(TRUE_LABELS)
    predicted_attributions = get_all_attributions(PREDICTED_DATA)
    return compute_metrics(true_attributions, predicted_attributions)

def report_heuristic_metrics():
    total_quotes_detected = 0
    heuristic_metrics = {}
    for heuristic in ['pattern_1', 'pattern_2', 'pattern_3', 'pattern_4', 'proximity']:
        precision, num_of_examples = compute_heuristic_metrics(heuristic)
        total_quotes_detected += num_of_examples
        heuristic_metrics[heuristic] = { 'precision': precision, 'num_of_examples': num_of_examples }
    for heuristic, metrics in heuristic_metrics.items():
        num_of_examples = metrics.pop('num_of_examples')
        share_of_total = round(float(num_of_examples / total_quotes_detected), NUM_SIG_FIGS)
        metrics['percent_share'] = round(share_of_total * 100, NUM_SIG_FIGS)
    return heuristic_metrics

def compute_metrics(true_labels, detected_labels):
    precision = compute_precision(true_labels, detected_labels)
    recall = compute_recall(true_labels, detected_labels)
    f1_score = compute_f1_score(precision, recall)
    return { "precision": precision, "recall": recall, "f1_score": f1_score }

def compute_heuristic_metrics(heuristic_filter):
    true_attributions = get_all_attributions(TRUE_LABELS)
    predicted_attributions = get_all_attributions(PREDICTED_DATA, heuristic_filter)
    precision = compute_precision(true_attributions, predicted_attributions)
    num_of_examples = len(predicted_attributions)
    return precision, num_of_examples

def compute_precision(true_labels, detected_labels):
    num_true_detected = get_num_true_detected(true_labels, detected_labels)
    num_detected = len(detected_labels)
    return round(float(num_true_detected / num_detected), NUM_SIG_FIGS)

def compute_recall(true_labels, detected_labels):
    num_true_detected = get_num_true_detected(true_labels, detected_labels)
    num_true = len(true_labels)
    return round(float(num_true_detected / num_true), NUM_SIG_FIGS)

def compute_f1_score(precision, recall):
    return round((2 * precision * recall) / (precision + recall), NUM_SIG_FIGS)

def get_num_true_detected(true_labels, detected_labels):
    true_labels = true_labels.copy()
    true_detected_labels = []
    for detected_label in detected_labels:
        if detected_label in true_labels:
            true_labels.remove(detected_label)
            true_detected_labels.append(detected_label)
    return len(true_detected_labels)

def get_all_quotes(data):
    all_quotes = []
    for article_obj in data['articles']:
        for attr_obj in article_obj['quotes_by_attribution']:
            quotes = [ obj['quote'] for obj in attr_obj['quotes'] ]
            all_quotes.extend(quotes)
    return all_quotes

def get_all_entities(data):
    all_entities = []
    for article_obj in data['articles']:
        for attr_obj in article_obj['quotes_by_attribution']:
            entity = attr_obj['attribution']
            all_entities.append(entity)
    return all_entities

def get_all_attributions(data, heuristic_filter=None):
    all_attributions = []
    for article_obj in data['articles']:
        for attr_obj in article_obj['quotes_by_attribution']:
            entity = attr_obj['attribution']
            if heuristic_filter:
                attributions = [ (entity, obj['quote']) for obj in attr_obj['quotes'] if obj['attribution_method'] == heuristic_filter ]
            else:
                attributions = [ (entity, obj['quote']) for obj in attr_obj['quotes'] ]
            all_attributions.extend(attributions)
    return all_attributions


if __name__ == "__main__":
    quote_data = report_quote_metrics()
    entity_data = report_entity_metrics()
    attr_data = report_attribution_metrics()
    heuristic_data = report_heuristic_metrics()
    with open(METRIC_SAVE_FILEPATH, "w") as f:
        metric_data = {
            'quote_metrics': quote_data, 
            'entity_metrics': entity_data, 
            'attribution_metrics': attr_data,
            'heuristic_metrics': heuristic_data
        }
        json.dump(metric_data, f, ensure_ascii=False, indent=2)