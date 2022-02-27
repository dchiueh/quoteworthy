import React, {Fragment, useMemo} from 'react';

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
import SearchListGroupedByEntity from '../../components/SearchListGroupedByEntity/SearchListGroupedByEntity';

class HomeScreen extends React.Component {
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
      this._handleKeyDown = this._handleKeyDown.bind(this);
      this._handleSearchButton = this._handleSearchButton.bind(this);
	}

	componentDidMount() {
      //TODO: fetch from backend; or just use hard-coded json
      this.setState({articles: NYT_MINI["articles"]});
	}

   componentDidUpdate() {
      console.log("JSON article data", this.state.articles);
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

   _handleKeyDown = (event) => {
      if (event.key === 'Enter') {
         const lowerSearch = this.state.searchWIP.toLowerCase();
         this.setState({searchPhrase: lowerSearch});

         const filteredArticles = useMemo(() => {
            return this.state.articles.filter(
               (article) => {
                  console.log("This is an article", article);
                  //unit.title.toLowerCase().includes(lowerSearch) ||
                  //unit.images.some((image) => image.metadata.name.toLowerCase().includes(lowerSearch)),

               }
            );
         }, [lowerSearch, this.state.articles]);
      }
    }

   _handleSearchButton(event) {
      if(event) {
         const lowerSearch = this.state.searchWIP.toLowerCase();
         //this.setState({searchButtonPressed: true});
         this.setState({searchPhrase: lowerSearch});
      
         // const filteredUsers = useMemo(() => {
         //    const lowerSearch = searchTerm.toLowerCase();
         //    return copy(kUsers.slice(1)).filter(
         //       //Hard-coded user is in kUsers slot 0
         //       (user) => user.name.toLowerCase().includes(lowerSearch),
         //    );
         // }, [searchTerm]);
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
                  InputProps={{ sx: { backgroundColor: "#f2f2f2", fontSize: "22"}}}
                  sx={{ backgroundColor: "white"}}
                  fullWidth
                  onChange={this._handleSearch}
                  onKeyDown={this._handleKeyDown}
               /> 
               {/* <Button variant="contained" onClick={this._handleSearchButton}>Search</Button> */}
               <div style={{flexDirection: "row", textAlign: "left"}}>
                  <Button style={{textTransform: "none", fontSize: 14, marginRight: "20px"}}> Date Range <ExpandMoreIcon/> </Button>
                  <Button style={{textTransform: "none", fontSize: 14, marginRight: "20px"}}> Section <ExpandMoreIcon/> </Button>
                  <Button style={{textTransform: "none", fontSize: 14}}> Location <ExpandMoreIcon/> </Button>

               </div>
            </Card> 
            
            <SearchListGroupedByEntity searchPhrase={this.state.searchPhrase} /> 
                     
         </React.Fragment>
		)
	};
}

export default HomeScreen;
