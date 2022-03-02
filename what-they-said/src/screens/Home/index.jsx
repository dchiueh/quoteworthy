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
// import SearchBox from '../../components/SearchBox/SearchBox';
import SearchListGroupedByEntity from '../../components/SearchListGroupedByEntity/SearchListGroupedByEntity';

class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         articles: [],
			filteredArticles: [],
         entityArticleGroupings: {},
         searchWIP: '',
			searchPhrase: '',
         searchButtonPressed: false,
         dateFilter: ["2010/1/1", "2020/12/31"],
         locationFilter: [""],
		}

      this._handleSearch = this._handleSearch.bind(this);
      this._handleKeyDown = this._handleKeyDown.bind(this);
	}

	componentDidMount() {
      //TODO: fetch from backend; or just use hard-coded json
      this.setState({articles: NYT_MINI["articles"]});
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
            
            const articlePeopleMatches = article.people && article.people.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;
            const articleKeywordsMatches = article.keywords && article.keywords.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;
            const articleAttributionseMatches = article.attributions && article.attributions.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;

            if((article.author.toLowerCase().includes(lowerSearch)
               || articlePeopleMatches
               || articleKeywordsMatches
               || articleAttributionseMatches
               || article.title.toLowerCase().includes(lowerSearch)
               || article.abstract.toLowerCase().includes(lowerSearch)
               )
               //&& articleLocationMatches
               && (dateCheck >= dateFrom && dateCheck <= dateTo)
            ) return true;

            return false;
         });

         console.log("filtered articles list", filteredArticles);

         //create a dictionary of mappings 
         const entityArticleGroupings = {};
         
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
               
               if(entityArticleGroupings[quoteByAttr.attribution]) {
                  entityArticleGroupings[quoteByAttr.attribution].push(quotesByArticleAttr);
               } else {
                  entityArticleGroupings[quoteByAttr.attribution] = [quotesByArticleAttr];
               }
            });
         
            console.log("quotes by attribution", article.quotes_by_attribution);
            console.log("unique entities", entityArticleGroupings);

            }
         )
         this.setState({
            filteredArticles: filteredArticles,
            entityArticleGroupings: entityArticleGroupings,
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
               <div style={{flexDirection: "row", textAlign: "left"}}>
                  <Button style={{textTransform: "none", fontSize: 14, marginRight: "20px"}}> Date Range <ExpandMoreIcon/> </Button>
                  <Button style={{textTransform: "none", fontSize: 14}}> Location <ExpandMoreIcon/> </Button>

               </div>
            </Card> 
            {/* <SearchBox searchWIP={this.state.searchWIP} onChange={this._handleSearch} onKeyDown={this._handleKeyDown} timeFilter={this.state.timeFilter} locationFilter={this.state.locationFilter} /> */}
            
            <div style={{width: "50%"}}>
               <SearchListGroupedByEntity entityArticleGroupings={this.state.entityArticleGroupings} searchPhrase={this.state.searchPhrase} /> 
            </div>
            {/*ArticleIFrame */} 
         </React.Fragment>
		)
	};
}

export default HomeScreen;
