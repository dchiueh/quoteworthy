# New York Times Archive Data as JSON
In order to make the New York Times data archive ready to be consumed by our Javascript frontend, we must parse our original CSV data files into [JSON](https://www.w3schools.com/js/js_json_intro.asp). 
We accomplish this by converting each row in the CSV into its corresponding a JSON object. We additionally attach the results of our [quote attribution extraction pipeline](https://github.com/alexanderjhurtado/cs206-what-they-said/blob/main/data/data_processing/quote_parser.py) to each JSON object.

We give an example of our JSON schema below. Note that:
- some fields (`title`, `author`, `abstract`, `slug`, `section`, and `location`) may be `null` and some lists may be empty
- the indices in the `quotes` array represent their respective token's index in `tokenized_text`
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
    "attributions": ["Crow", "Jason Crow"],
    "original_text": "The former Army Ranger was to take a high-profile role prosecuting House Democrats’ case against President Trump in the Senate trial. WASHINGTON — As a former Army Ranger who served in Iraq and Afghanistan, Representative Jason Crow, who flipped a Republican-held seat in 2018, has quickly emerged in the Democratic caucus as a leading voice on national security. Drawing on those credentials and his experience as a litigator, Speaker Nancy Pelosi named the Colorado Democrat as an impeachment manager on Wednesday, selecting him as part of the team of lawmakers who will play a high-profile role prosecuting House Democrats’ case against President Trump in the Senate trial. Mr. Crow is a first-term lawmaker — one of only two among a seven-person manager team — and he does not serve on any of the committees that have been leading the impeachment inquiry. So his selection to play a high-profile role in the impeachment trial underscores the crucial role national security-minded freshmen have played in the House investigation. Mr. Crow was among a group of seven freshmen from conservative-leaning districts — all veterans or former intelligence analysts — who wrote an op-ed urging Congress to impeach Mr. Trump if the allegations were true that he withheld military aid to Ukraine as part of an attempt to get the country to investigate his political rivals. The piece was seen by many as a crucial development that encouraged Democratic lawmakers by indicating they had enough backing — including among their politically vulnerable colleagues — to press ahead and open an inquiry into the president. “He allegedly sought to use the very security assistance dollars appropriated by Congress to create stability in the world, to help root out corruption and to protect our national security interests, for his own personal gain,” Mr. Crow and his colleagues wrote. “These allegations are stunning, both in the national security threat they pose and the potential corruption they represent.” While Mr. Crow is best known for his advocacy on gun safety measures and his service in the Army, where he was honored with the Bronze Star, he worked as a litigator after his tours in Iraq and Afghanistan, specializing in white-collar defense and government investigations. He has since emerged as one of the most outspoken freshmen from a swing district urging the House to take on Mr. Trump. “If Congress doesn’t stand up to these abuses, then our system of checks and balances will have failed,” Mr. Crow said shortly after announcing he would support the impeachment inquiry. “It’s clear that we must respond with the full weight of Congress.” PHOTO",
    "tokenized_text": ["The", "former", "Army", "Ranger", "was", "to", "take", "a", "high", "-", "profile", "role", "prosecuting", "House", "Democrats", "’", "case", "against", "President", "Trump", "in", "the", "Senate", "trial", ".", "WASHINGTON", "—", "As", "a", "former", "Army", "Ranger", "who", "served", "in", "Iraq", "and", "Afghanistan", ",", "Representative", "Jason", "Crow", ",", "who", "flipped", "a", "Republican", "-", "held", "seat", "in", "2018", ",", "has", "quickly", "emerged", "in", "the", "Democratic", "caucus", "as", "a", "leading", "voice", "on", "national", "security", ".", "Drawing", "on", "those", "credentials", "and", "his", "experience", "as", "a", "litigator", ",", "Speaker", "Nancy", "Pelosi", "named", "the", "Colorado", "Democrat", "as", "an", "impeachment", "manager", "on", "Wednesday", ",", "selecting", "him", "as", "part", "of", "the", "team", "of", "lawmakers", "who", "will", "play", "a", "high", "-", "profile", "role", "prosecuting", "House", "Democrats", "’", "case", "against", "President", "Trump", "in", "the", "Senate", "trial", ".", "Mr.", "Crow", "is", "a", "first", "-", "term", "lawmaker", "—", "one", "of", "only", "two", "among", "a", "seven", "-", "person", "manager", "team", "—", "and", "he", "does", "not", "serve", "on", "any", "of", "the", "committees", "that", "have", "been", "leading", "the", "impeachment", "inquiry", ".", "So", "his", "selection", "to", "play", "a", "high", "-", "profile", "role", "in", "the", "impeachment", "trial", "underscores", "the", "crucial", "role", "national", "security", "-", "minded", "freshmen", "have", "played", "in", "the", "House", "investigation", ".", "Mr.", "Crow", "was", "among", "a", "group", "of", "seven", "freshmen", "from", "conservative", "-", "leaning", "districts", "—", "all", "veterans", "or", "former", "intelligence", "analysts", "—", "who", "wrote", "an", "op", "-", "ed", "urging", "Congress", "to", "impeach", "Mr.", "Trump", "if", "the", "allegations", "were", "true", "that", "he", "withheld", "military", "aid", "to", "Ukraine", "as", "part", "of", "an", "attempt", "to", "get", "the", "country", "to", "investigate", "his", "political", "rivals", ".", "The", "piece", "was", "seen", "by", "many", "as", "a", "crucial", "development", "that", "encouraged", "Democratic", "lawmakers", "by", "indicating", "they", "had", "enough", "backing", "—", "including", "among", "their", "politically", "vulnerable", "colleagues", "—", "to", "press", "ahead", "and", "open", "an", "inquiry", "into", "the", "president", ".", "“", "He", "allegedly", "sought", "to", "use", "the", "very", "security", "assistance", "dollars", "appropriated", "by", "Congress", "to", "create", "stability", "in", "the", "world", ",", "to", "help", "root", "out", "corruption", "and", "to", "protect", "our", "national", "security", "interests", ",", "for", "his", "own", "personal", "gain", ",", "”", "Mr.", "Crow", "and", "his", "colleagues", "wrote", ".", "“", "These", "allegations", "are", "stunning", ",", "both", "in", "the", "national", "security", "threat", "they", "pose", "and", "the", "potential", "corruption", "they", "represent", ".", "”", "While", "Mr.", "Crow", "is", "best", "known", "for", "his", "advocacy", "on", "gun", "safety", "measures", "and", "his", "service", "in", "the", "Army", ",", "where", "he", "was", "honored", "with", "the", "Bronze", "Star", ",", "he", "worked", "as", "a", "litigator", "after", "his", "tours", "in", "Iraq", "and", "Afghanistan", ",", "specializing", "in", "white", "-", "collar", "defense", "and", "government", "investigations", ".", "He", "has", "since", "emerged", "as", "one", "of", "the", "most", "outspoken", "freshmen", "from", "a", "swing", "district", "urging", "the", "House", "to", "take", "on", "Mr.", "Trump", ".", "“", "If", "Congress", "does", "n’t", "stand", "up", "to", "these", "abuses", ",", "then", "our", "system", "of", "checks", "and", "balances", "will", "have", "failed", ",", "”", "Mr.", "Crow", "said", "shortly", "after", "announcing", "he", "would", "support", "the", "impeachment", "inquiry", ".", "“", "It", "’s", "clear", "that", "we", "must", "respond", "with", "the", "full", "weight", "of", "Congress", ".", "”", "PHOTO"],
    "quotes_by_attribution": [
      {
        "attribution": "Crow",
        "quotes": [
          {
            "quote": "He allegedly sought to use the very security assistance dollars appropriated by Congress to create stability in the world , to help root out corruption and to protect our national security interests , for his own personal gain ,",
            "start_quote_index": 292,
            "end_quote_index": 332,
            "attribution_index": 334
          }
        ]
      },
      {
        "attribution": "Jason Crow",
        "quotes": [
          {
            "quote": "These allegations are stunning , both in the national security threat they pose and the potential corruption they represent .",
            "start_quote_index": 340,
            "end_quote_index": 361,
            "attribution_index": 363
          },
          {
            "quote": "If Congress does n’t stand up to these abuses , then our system of checks and balances will have failed ,",
            "start_quote_index": 438,
            "end_quote_index": 460,
            "attribution_index": 461
          },
          {
            "quote": "It ’s clear that we must respond with the full weight of Congress .",
            "start_quote_index": 474,
            "end_quote_index": 489,
            "attribution_index": 467
          }
        ]
      }
    ]
  }, /* ... many other article objects ... */ ]
}
```