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

```
{
  "quote_metrics": {
    "precision": 0.923,
    "recall": 0.975,
    "f1_score": 0.948
  },
  "entity_metrics": {
    "precision": 0.903,
    "recall": 0.942,
    "f1_score": 0.922
  },
  "attribution_metrics": {
    "precision": 0.894,
    "recall": 0.944,
    "f1_score": 0.918
  },
  "heuristic_metrics": {
    "pattern_1": {
      "precision": 0.981,
      "percent_share": 31.9
    },
    "pattern_2": {
      "precision": 1.0,
      "percent_share": 13.0
    },
    "pattern_3": {
      "precision": 0.941,
      "percent_share": 34.8
    },
    "pattern_4": {
      "precision": 1.0,
      "percent_share": 5.3
    },
    "proximity": {
      "precision": 0.471,
      "percent_share": 15.0
    }
  }
}
```
