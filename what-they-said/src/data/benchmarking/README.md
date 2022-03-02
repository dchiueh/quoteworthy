# Benchmarking Metrics: Explained

### Precision: 
- The ratio of correctly predicted positive observations to the total predicted positive observations
- Answers the question: "_of all the quotes/entities/attributions we found, how many of them are actually correct?_"
- Higher precision = lower false positive rate = less false quotes/entities/attributions 

### Recall:
- The ratio of correctly predicted positive observations to the all observations in actual class
- Answers the question: "_of all the quotes/entities/attributions that actually exist, how many did we correctly find?_"
- Higher recall = lower false negative rate = more true quotes/entities/attributions

### F1 Score:
- The weighted average of precision and recall
- Our proxy for accuracy (_if we consider false positives and false negatives to be equally bad_)

```
{
  "quote_metrics": {
    "precision": 0.918,
    "recall": 0.978,
    "f1_score": 0.947
  },
  "entity_metrics": {
    "precision": 0.774,
    "recall": 0.819,
    "f1_score": 0.796
  },
  "attribution_metrics": {
    "precision": 0.735,
    "recall": 0.783,
    "f1_score": 0.758
  },
  "heuristic_metrics": {
    "pattern_1": {
      "precision": 0.917,
      "share_of_total": 17.5
    },
    "pattern_2": {
      "precision": 0.911,
      "share_of_total": 13.1
    },
    "pattern_3": {
      "precision": 0.795,
      "share_of_total": 38.5
    },
    "pattern_4": {
      "precision": 0.905,
      "share_of_total": 6.1
    },
    "proximity": {
      "precision": 0.376,
      "share_of_total": 24.8
    }
  }
}
```
