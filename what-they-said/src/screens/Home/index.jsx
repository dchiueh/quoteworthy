import React, {Fragment} from 'react';
import _memoize from 'lodash.memoize';

import { styled } from '@mui/material/styles';

import { 
  Box,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  PopupState,
  TextField,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import NYT_MINI from '../../data/nyt_2020_mini.json';
import NYT_POLITICS from '../../data/nyt_politics.json';
// import SearchBox from '../../components/SearchBox/SearchBox';
import SearchListGroupedByEntity from '../../components/SearchListGroupedByEntity/SearchListGroupedByEntity';

function descendingComparator(a, b, orderBy) {
   if (b[orderBy] < a[orderBy]) {
      return -1;
   }
   if (b[orderBy] > a[orderBy]) {
      return 1;
   }
   return 0;
}

function getComparator(order, orderBy) {
   return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         articles: [],
			filteredArticles: [],
         sortedEntityArticleGroupingsArray: [],
         entityArticleGroupings: {},
         numTotalQuotes: 0,
         numTotalEntities: 0,
         searchWIP: '',
			searchPhrase: '',
         searchButtonPressed: false,
         dateFilter: ["2010/1/1", "2020/12/31"],
         locationFilter: [""],
         displayedUrl: "" //"https://www.nytimes.com/2020/01/20/sports/golf/tiger-woods-Olympics.html",
		}

      this._handleSearch = this._handleSearch.bind(this);
      this._handleKeyDown = this._handleKeyDown.bind(this);
	}

	componentDidMount() {
      //TODO: fetch from backend; or just use hard-coded json
      this.setState({articles: NYT_POLITICS["articles"]});
	}

   componentDidUpdate() {
      //console.log("JSON article data", this.state.articles);
   }

   //use this to trigger article listing change
	_handleSearch(event) {
		if (event) {
         let text = event.target.value;
			this.setState({searchWIP: text});
         
			// let filteredArticles = this.state.articles.filter(
			// 	(article) =>
			// 		article.name.includes(lowerSearch)
			// );

			// this.setState({ 
			// 	filteredArticles: filteredArticles,
			// });
		} else {
			this.setState({ 
				searchWIP: "",
			});
		}
	}

   _handleKeyDown(event) {
      if (event.key === 'Enter') {
         const lowerSearch = this.state.searchWIP.toLowerCase();
         this.setState({searchPhrase: lowerSearch});

         const filteredArticles = this.state.articles.filter((article) => {
            //Broken up into this ugly callback with if/else curly braces 
            //as our categories are still in flux (also need to test with large dataset)
            const dateFrom = new Date(this.state.dateFilter[0]);
            const dateTo = new Date(this.state.dateFilter[1]);
            const dateCheck = new Date(article.publish_date);

            const articleLocationMatches = article.locations && article.locations.filter(name => this.state.locationFilter.includes(name.toLowerCase()));
            
            const articleAuthorMatches = article.author && article.author.toLowerCase().includes(lowerSearch);
            const articleTitleMatches = article.title && article.title.toLowerCase().includes(lowerSearch);
            const articleAbstractMatches = article.abstract && article.abstract.toLowerCase().includes(lowerSearch);
            
            const articlePeopleMatches = article.people && article.people.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;
            const articleKeywordsMatches = article.keywords && article.keywords.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;
            const articleAttributionseMatches = article.attributions && article.attributions.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;

            if((articleAuthorMatches
               || articlePeopleMatches
               || articleKeywordsMatches
               || articleAttributionseMatches
               || articleTitleMatches
               || articleAbstractMatches
               )
               //&& articleLocationMatches
               && (dateCheck >= dateFrom && dateCheck <= dateTo)
            ) return true;

            return false;
         });

         //console.log("filtered articles list", filteredArticles);

         //create a dictionary of mappings 
         let entityArticleGroupings = {};
         let entityArticleGroupingsSortedArray = [];
         let numTotalEntities = 0;
         let numTotalQuotes = 0;
         
         filteredArticles.forEach((article) => {
            article.quotes_by_attribution.map((quoteByAttr) => {
               const quotesByArticleAttr = {
                  entity: quoteByAttr.attribution,
                  title: article.title,
                  url: article.url,
                  slug: article.slug,
                  publish_date: article.publish_date,
                  location: article.location,
                  keywords: article.keywords,
                  quotes: quoteByAttr.quotes
               }
               numTotalQuotes += quoteByAttr.quotes.length;
               
               if(entityArticleGroupings[quoteByAttr.attribution]) {
                  entityArticleGroupings[quoteByAttr.attribution].push(quotesByArticleAttr);
               } else {
                  entityArticleGroupings[quoteByAttr.attribution] = [quotesByArticleAttr];
                  numTotalEntities += 1;
               }
            });
         })

         //Inefficient but stable hack to sort filtered entities without changing too much code
         //Kept the key-value object, and now the sorted array, for future work / stability across last-minute additions
         let sortedEntityArticleGroupingsArray = [];
         for (let entity in entityArticleGroupings) {
            sortedEntityArticleGroupingsArray.push(entityArticleGroupings[entity]);
         }
   
         sortedEntityArticleGroupingsArray.sort(function (a, b) {
            return a.length === b.length ? 0 : (a > b ? -1: 1);
         });
      
         //console.log("unique entities", entityArticleGroupings);
         //console.log("sorted entities", sortedEntityArticleGroupingsArray);

         this.setState({
            //filteredArticles: filteredArticles,
            sortedEntityArticleGroupingsArray: sortedEntityArticleGroupingsArray,
            entityArticleGroupings: entityArticleGroupings,
            numTotalEntities: numTotalEntities,
            numTotalQuotes: numTotalQuotes,
         });
      }
   }

	render() {
		return (
         <React.Fragment>
            <Card>
               <TextField id="search-phrase" type="search" placeholder="enter a search phrase"
                  value={this.state.searchWIP}
                  InputProps={{ sx: { backgroundColor: "#f2f2f2", fontSize: "22"}}}
                  sx={{ backgroundColor: "white"}}
                  fullWidth
                  onChange={this._handleSearch}
                  onKeyDown={this._handleKeyDown}
               /> 
               {/* <Button variant="contained" onClick={this._handleSearchButton}>Search</Button> */}
               <div style={{display: "flex", flexDirection: "row", textAlign: "left", alignItems:"center"}}>
                  <div style={{padding:"0px 5px", marginRight:"15px"}}>Filter results by date or location:</div>
                  <Button style={{textTransform: "none", fontSize: 14, marginRight: "20px"}}> Date Range <ExpandMoreIcon/> </Button>
                  <Button style={{textTransform: "none", fontSize: 14}}> Location <ExpandMoreIcon/> </Button>

               </div>
            </Card> 
            {/* <SearchBox searchWIP={this.state.searchWIP} onChange={this._handleSearch} onKeyDown={this._handleKeyDown} timeFilter={this.state.timeFilter} locationFilter={this.state.locationFilter} /> */}
            <div style={{height: "20px", padding: "20px"}}>
               {this.state.numTotalEntities > 0 && <Typography color="black" sx={{ fontSize: "16px", textDecoration: "none", fontFamily:"Imperial BT" }}>
                  {`Quoteworthy found ${this.state.numTotalEntities} entities, with ${this.state.numTotalQuotes} quote${this.state.numTotalQuotes > 1 ? "s" : ""}`}
               </Typography>}
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
               <div style={{display: "block", flex: "1"}}>
                  <SearchListGroupedByEntity entityArticleGroupings={this.state.entityArticleGroupings} sortedEntityArticleGroupingsArray={this.state.sortedEntityArticleGroupingsArray} searchPhrase={this.state.searchPhrase} /> 
               </div>
               <div style={{display: "block", flex: "1"}}>
                  <iframe 
                     frameBorder="0" 
                     src={this.state.displayedUrl}
                     allowFullScreen={true} 
                     scrolling="yes" 
                     width="100%" 
                     height="100%">
                  </iframe>
               </div>
            </div>
            {/*ArticleIFrame */} 
         </React.Fragment>
		)
	};
}

export default HomeScreen;
