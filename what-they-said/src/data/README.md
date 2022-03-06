# New York Times Archive Data as JSON
In order to make the New York Times data archive ready to be consumed by our Javascript frontend, we must parse our original CSV data files into [JSON](https://www.w3schools.com/js/js_json_intro.asp). 
We accomplish this by converting each row in the CSV into its corresponding a JSON object. We additionally attach the results of our [quote attribution extraction pipeline](https://github.com/alexanderjhurtado/cs206-what-they-said/blob/main/what-they-said/src/data/data_processing/quote_parser.py) to each JSON object.

We give an example of our JSON schema below. Note that:
- some fields (`title`, `author`, `abstract`, `slug`, `section`, and `location`) may be `null` and some lists may be empty
- the indices in the `quotes` array represent their respective token's index as tokenized using [spaCy](https://spacy.io/api/tokenizer)
```javascript
data = {
  "articles": [{
    "title": "Jason Crow: Impeachment Manager Who Pressed to Launch Inquiry",
    "publish_date": "2020-01-15",
    "url": "https://www.nytimes.com/2020/01/15/us/politics/jason-crow.html",
    "author": "By Catie Edmondson",
    "abstract": "The former Army Ranger was to take a high-profile role prosecuting House Democrats’ case against President Trump in the Senate trial.",
    "slug": "National",
    "section": "U.S.",
    "people": ["Crow, Jason", "Pelosi, Nancy", "Trump, Donald J"],
    "keywords": ["Trump-Ukraine Whistle-Blower Complaint and Impeachment Inquiry", "United States Army Rangers", "Crow, Jason", "Pelosi, Nancy", "Trump, Donald J"],
    "location": "WASHINGTON",
    "attributions": ["Jason Crow"],
    "quotes_by_attribution": [
      {
        "attribution": "Jason Crow",
        "quotes": [
          {
            "quote": "He allegedly sought to use the very security assistance dollars appropriated by Congress to create stability in the world, to help root out corruption and to protect our national security interests, for his own personal gain,",
            "context": null,
            "start_quote_index": 292,
            "end_quote_index": 332,
            "attribution_index": 334,
            "attribution_method": "proximity",
            "original_attribution": "Crow"
          },
          {
            "quote": "These allegations are stunning, both in the national security threat they pose and the potential corruption they represent.",
            "context": null,
            "start_quote_index": 340,
            "end_quote_index": 361,
            "attribution_index": 336,
            "attribution_method": "pattern_3"
          },
          {
            "quote": "If Congress doesn’t stand up to these abuses, then our system of checks and balances will have failed,",
            "context": null,
            "start_quote_index": 438,
            "end_quote_index": 460,
            "attribution_index": 461,
            "attribution_method": "pattern_1"
          },
          {
            "quote": "It’s clear that we must respond with the full weight of Congress.",
            "context": null,
            "start_quote_index": 474,
            "end_quote_index": 489,
            "attribution_index": 462,
            "attribution_method": "pattern_3"
          }
        ]
      }
    ]
  }, /* ... many other article objects ... */ ]
}
```
