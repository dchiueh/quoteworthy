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

class SearchBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         articles: [],
			filteredArticles: [],
			searchPhrase: '',
		}

      this._handleSearch = this._handleSearch.bind(this);
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
			this.setState({searchPhrase: text});
         
         const lowerSearch = text.toLowerCase();

			let filteredArticles = this.state.articles.filter(
				(article) =>
					article.name.includes(lowerSearch)
			);

			this.setState({ 
				filteredArticles: filteredArticles,
			});
		} else {
			this.setState({ 
				searchPhrase: "",
			});
		}
	}

	render() {
		return (
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
               {/* <Typography variant="h5" color="black">
                  Example article title
               </Typography>
               <Typography variant="h6" color="black">
                  "This is an example quote"
               </Typography> */}
            </CardContent>
            <TextField id="search=phrase" type="search" placeholder="enter a search phrase"
               value={this.state.searchPhrase}
               InputProps={{ sx: { backgroundColor: "#f2f2f2"}}}
               sx={{ backgroundColor: "white"}}
               fullWidth
               onChange={this._handleSearch}
            /> 
            <Button variant="contained">Search</Button>

         </Card>

		)
	};
}

export default SearchBox;
