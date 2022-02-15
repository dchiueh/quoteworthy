import React from 'react';

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
  TextField,
  Typography
} from '@mui/material';

import SearchListGroupedByEntity from '../SearchListGroupedByEntity/SearchListGroupedByEntity';

class SearchBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         articles: [],
			filteredArticles: [],
         searchWIP: '',
			searchPhrase: '',
         searchButtonPressed: false,
		}

      this._handleSearch = this._handleSearch.bind(this);
      this._handleSearchButton = this._handleSearchButton.bind(this);
	}

	componentDidMount() {
   ////todo: fetch from backend
		// var temp = this.state.routes;
		// firebase.database().ref('paths/').on('value', function (snapshot) {
		// 	snapshot.forEach(doc => {
		// 		temp.push(doc.val());
		// 	})
		// 	this.setState({ routes: temp });
		// }.bind(this), function (error) {
		// 	console.log('Error' + error.code);
		// });
		// this.setState({ 
		// 	routes: temp,
		// 	filteredRoutes: temp,
		// });
	}

   //use this to trigger article listing change
	_handleSearch(event) {
		if (event) {
         let text = event.target.value;
			this.setState({searchWIP: text});
         
         const lowerSearch = text.toLowerCase();

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

   _handleSearchButton(event) {
      if(event) {
         //this.setState({searchButtonPressed: true});
         this.setState({searchPhrase: this.state.searchWIP});
      }
   }

	render() {
		return (
         <React.Fragment>
            <Card>
               {/*TODO: decompose the tags / filtering to a new component */}
               <CardContent>
               {/* <FormControlLabel
                  label="Parent"
                  control={
                     <Checkbox
                        checked={checked[0] && checked[1]}
                        onChange={handleChange1}
                     />
                  }
                  /> */}
               </CardContent>
               <TextField id="search-phrase" type="search" placeholder="enter a search phrase"
                  value={this.state.searchWIP}
                  InputProps={{ sx: { backgroundColor: "#f2f2f2"}}}
                  sx={{ backgroundColor: "white"}}
                  fullWidth
                  onChange={this._handleSearch}
               /> 
               <Button variant="contained" onClick={this._handleSearchButton}>Search</Button>
            </Card> 
            
            <SearchListGroupedByEntity searchPhrase={this.state.searchPhrase} /> 
                     
         </React.Fragment>
		)
	};
}

export default SearchBox;
