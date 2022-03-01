# Benchmarking Metrics: Explained

### Precision: 
- The ratio of correctly predicted positive observations to the total predicted positive observations
- Answers the question: "_of all the quotes/entities/attributions we found, how many of them are actually correct?_"
- Higher precision = lower false positive rate = less false quotes/entities/attributions 

### Recall:
- The ratio of correctly predicted positive observations to the all observations in actual class
- Answers the question: "_of all the actual quotes/entities/attributions, how many did we correctly find?_"
- Higher recall = lower false negative rate = more true quotes/entities/attributions

### F1 Score:
- The weighted average of precision and recall
- Our proxy for accuracy (_if we consider false positives and false negatives to be equally bad_)
