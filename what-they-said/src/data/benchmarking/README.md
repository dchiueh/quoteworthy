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
    "precision": 0.92,
    "recall": 0.966,
    "f1_score": 0.942
  },
  "entity_metrics": {
    "precision": 0.833,
    "recall": 0.87,
    "f1_score": 0.851
  },
  "attribution_metrics": {
    "precision": 0.828,
    "recall": 0.87,
    "f1_score": 0.848
  },
  "heuristic_metrics": {
    "pattern_1": {
      "precision": 0.95,
      "percent_share": 17.8
    },
    "pattern_2": {
      "precision": 0.956,
      "percent_share": 13.3
    },
    "pattern_3": {
      "precision": 0.908,
      "percent_share": 38.5
    },
    "pattern_4": {
      "precision": 1.0,
      "percent_share": 6.2
    },
    "proximity": {
      "precision": 0.5,
      "percent_share": 24.3
    }
  }
}
```
