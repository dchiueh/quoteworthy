import React, { Fragment } from 'react';
import _memoize from 'lodash.memoize';
import _ from "lodash";
import { styled } from '@mui/material/styles';
import { css } from "@emotion/react";

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
   FormGroup,
   FormControlLabel,
   IconButton,
   Menu,
   MenuItem,
   Paper,
   PopupState,
   TextField,
   Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import GridLoader from "react-spinners/GridLoader";

import NYT_MINI from '../../data/nyt_2020_mini.json';
import NYT_POLITICS from '../../data/nyt_politics.json';
// import SearchBox from '../../components/SearchBox/SearchBox';
import SearchListGroupedByEntity from '../../components/SearchListGroupedByEntity/SearchListGroupedByEntity';
import zIndex from '@mui/material/styles/zIndex';


const override = css`
  display: block;
  margin: 0 auto;
  border-color: blue;
`;
const locations = ["Washington"];

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
         prevSearchPhrase: '',
         searchButtonPressed: false,
         locationFilter: [false],
         prevLocationFilter: null,
         dateFrom: new Date("2018/1/1"),
         dateTo: new Date("2020/12/31"),
         prevDateFrom: null,
         prevDateTo: null,
         anchorEl: null,
         dateMenuOpen: false,
         locationMenuOpen: false,
         userOnboarded: false,
         isLoading: false,
         //activeCard: false,
         iframeUrl: "" //"https://www.nytimes.com/2020/01/20/sports/golf/tiger-woods-Olympics.html",
      }

      // this._setIframeUrl = this._setIframeUrl.bind(this);
      this._handleSearch = this._handleSearch.bind(this);
      this._handleKeyDown = this._handleKeyDown.bind(this);
      this._handleDateFrom = this._handleDateFrom.bind(this);
      this._handleDateTo = this._handleDateTo.bind(this);

      this._filterArticles = this._filterArticles.bind(this);
      this._handleLocationCheckbox = this._handleLocationCheckbox.bind(this);
   }

   componentDidMount() {
      //TODO: fetch from backend; or just use hard-coded json
      this.setState({ articles: NYT_POLITICS["articles"] });
   }

   componentDidUpdate() {
      // console.log("did update");
      // if(this.state.dateFrom !== this.state.prevDateFrom
      //    || this.state.dateTo !== this.state.prevDateTo
      //    || this.state.locationFilter !== this.state.prevLocationFilter
      //    || this.state.searchPhrase !== this.state.prevSearchPhrase
      //    ) {
      //    console.log("nested update check");
      //    this._filterArticles();
      // }
      //console.log("did update see state", this.state.sortedEntityArticleGroupingsArray);
      //console.log("JSON article data", this.state.articles);
   }

   _handleMenuClick(event) {
      this.setState({ anchorEl: event.currentTarget });
   }

   _handleMenuClose(event) {
      this.setState({ anchorEl: null });
   }

   // _setIframeUrl(url) {
   //    this.setState({
   //       iframeUrl: url,
   //       //activeCard: true,
   //    })
   // }

   _handleDateFrom(date) {
      this.setState({ dateFrom: date })
   }

   _handleDateTo(date) {
      this.setState({ dateTo: date })
   }

   _handleLocationCheckbox(position) {
      const updatedCheckedState = this.state.locationFilter.map((location, index) =>
      index === position ? !location : location
    );

      this.setState({
         locationFilter: updatedCheckedState,
      });
   }

   //use this to trigger article listing change
   _handleSearch(event) {
      if (event) {
         let text = event.target.value;
         this.setState({ searchWIP: text });

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
         this._filterArticles();
      }
   }

   _filterArticles() {
      const lowerSearch = this.state.searchWIP.toLowerCase();
      const allWords = lowerSearch.split(",");

      const filteredArticles = this.state.articles.filter((article) => {
         //Broken up into this ugly callback with if/else curly braces 
            //Broken up into this ugly callback with if/else curly braces 
         //Broken up into this ugly callback with if/else curly braces 
         //as our categories are still in flux (also need to test with large dataset)
         const dateFrom = this.state.dateFrom;
         const dateTo = this.state.dateTo;
         const dateCheck = new Date(article.publish_date);

         const activeLocations = [];
         this.state.locationFilter.forEach((value, index) => { if(value) { activeLocations.push(locations[index].toLowerCase())} });

         let articleLocationMatches = article.location && activeLocations.includes(article.location.toLowerCase());
         if(!this.state.locationFilter[0]) articleLocationMatches = true; //temp workaround if nothing is selected

         const articleAuthorMatches = article.author && article.author.toLowerCase().includes(lowerSearch);
         const articleTitleMatches = article.title && article.title.toLowerCase().includes(lowerSearch);
         let articleAbstractMatches = article.abstract && article.abstract.toLowerCase().includes(lowerSearch);

         const articlePeopleMatches = article.people && article.people.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;
         const articleKeywordsMatches = article.keywords && article.keywords.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;
         const articleAttributionseMatches = article.attributions && article.attributions.filter(name => name.toLowerCase().includes(lowerSearch)).length > 0;

         //console.log("articleLocationMatches", articleLocationMatches);
         
         if(allWords.length > 1) {
            articleAbstractMatches = article.abstract && allWords.every(keyword => article.abstract.toLowerCase().includes(keyword));

            if(articleAbstractMatches
               && articleLocationMatches
               && (dateCheck >= dateFrom && dateCheck <= dateTo)
            ) return true;
            return false; 
         } else {

            if ((articleAuthorMatches
               || articlePeopleMatches
               || articleKeywordsMatches
               || articleAttributionseMatches
               || articleTitleMatches
               || articleAbstractMatches
            )
               && articleLocationMatches
               && (dateCheck >= dateFrom && dateCheck <= dateTo)
            ) return true;
   
            return false;

         }
         //article.abstract && article.abstract.toLowerCase().includes(lowerSearch);
      });

      //console.log("filtered articles list", filteredArticles);

      let entityArticleGroupings = {};
      let numTotalEntities = 0;
      let numTotalQuotes = 0;

      filteredArticles.forEach((article) => {
         article.quotes_by_attribution.forEach((quoteByAttr) => {
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

            if (entityArticleGroupings[quoteByAttr.attribution]) {
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
         let entityEntries = entityArticleGroupings[entity];

         entityEntries.sort(function (a, b) {
            let dateA = new Date(a.publish_date);
            let dateB = new Date(b.publish_date);

            if (dateA === dateB) {
               return 0;
            }
            else if (dateA > dateB) {
               return -1;
            } else {
               return 1;
            }
         });
         //console.log("sorted entity Entries", entityEntries);
         sortedEntityArticleGroupingsArray.push(entityEntries);
      }

      sortedEntityArticleGroupingsArray.sort(function (a, b) {
         return a.length === b.length ? 0 : (a > b ? -1 : 1);
      });

      //console.log("unique entities", entityArticleGroupings);
      console.log("sorted entities", sortedEntityArticleGroupingsArray);

      this.setState((state) => ({
         //filteredArticles: filteredArticles,
         searchPhrase: lowerSearch,
         prevSearchPhrase: lowerSearch,
         prevLocationFilter: state.locationFilter,
         prevDateFrom: state.dateFrom,
         prevDateTo: state.dateTo,
         sortedEntityArticleGroupingsArray: sortedEntityArticleGroupingsArray,
         entityArticleGroupings: entityArticleGroupings,
         numTotalEntities: numTotalEntities,
         numTotalQuotes: numTotalQuotes,
         isLoading: false,
         userOnboarded: true,
      }));
   }

   render() {
      return (
         <React.Fragment>
            <Paper>
               <TextField id="search-phrase" type="search" placeholder="search a keyword, such as election"
                  value={this.state.searchWIP}
                  InputProps={{ sx: {backgroundColor: "#f2f2f2", fontSize: "18px", fontFamily:'Imperial BT' }}}
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  onChange={this._handleSearch}
                  onKeyDown={this._handleKeyDown}
               />
               {/* <Button variant="contained" onClick={this._handleSearchButton}>Search</Button> */}
               <div style={{ display: "flex", flexDirection: "row", textAlign: "left", alignItems: "center", minHeight: "24px" }}>
                  {/* <div style={{padding:"0px 5px"}}>Filter results by date</div> */}
                  <Button style={{ textTransform: "none", fontSize: 16, marginRight: "20px", fontFamily:'Imperial BT', display: "block" }} onClick={() => this.setState({ dateMenuOpen: !this.state.dateMenuOpen })}> Filter By Date {'>'} </Button>
                     <div style={{ display: this.state.dateMenuOpen ? "flex" : "none", flexDirection: "row", fontSize: 16, paddingTop: 4 }}>
                        From:&nbsp;<DatePicker selected={this.state.dateFrom} onChange={(date) => this._handleDateFrom(date)} style={{fontFamily: "Imperial BT" }} />
                        &nbsp;To:&nbsp;<DatePicker selected={this.state.dateTo} onChange={(date) => this._handleDateTo(date)} style={{fontFamily: "Imperial BT" }} />
                     </div>
                  
                  <Button style={{ textTransform: "none", fontSize: 16, marginRight: "6px", fontFamily:'Imperial BT', display: "block" }} onClick={() => this.setState({ locationMenuOpen: !this.state.locationMenuOpen })}> Filter By Location {'>'} </Button>
                     <div style={{ display: this.state.locationMenuOpen ? "flex" : "none", flexDirection: "row" }}>
                        {locations.map((location, index) => {
                           return (
                              <React.Fragment>
                                 <input
                                 type="checkbox"
                                 id={`location-checkbox-${index}`}
                                 name={location}
                                 value={location}
                                 checked={this.state.locationFilter[index]}
                                 onChange={() => this._handleLocationCheckbox(index)}
                                 style={{height: "20px", width: "20px"}}
                                 />
                                 <Typography style={{fontSize: 16, fontFamily: 'Imperial BT'}}>{`${location} Only`}</Typography>
                              </React.Fragment>
                           )
                        })}
                     </div>
               </div>
            </Paper>
            <Paper>           
               {this.state.userOnboarded && 
                  <div style={{ height: "20px", padding: "20px" }}>
                     <Typography color="black" sx={{ fontSize: "16px", textDecoration: "none", fontFamily: "Imperial BT" }}>
                        {`Quoteworthy found ${this.state.numTotalEntities} people, with ${this.state.numTotalQuotes} total quote${(this.state.numTotalQuotes > 1 || this.state.numTotalQuotes <= 0) ? "s" : ""}`}
                     </Typography>
                  </div>
               }
               <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                  <div style={{ display: "block", width: "75%" }}>
                     <SearchListGroupedByEntity
                        sortedEntityArticleGroupingsArray={this.state.sortedEntityArticleGroupingsArray}
                        searchPhrase={this.state.searchPhrase}
                     // _setIframeUrl={this._setIframeUrl}
                     />
                  </div>
               </div>
            </Paper>
         </React.Fragment>
      )
   };
}

export default HomeScreen;
