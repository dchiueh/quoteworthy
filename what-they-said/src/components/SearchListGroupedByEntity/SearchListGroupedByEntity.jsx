import React from 'react';

import { styled } from '@mui/material/styles';

import { 
  Avatar,
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

import EntityCard from '../EntityCard/EntityCard';

class SearchListGroupedByEntity extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         articles: [],
			filteredArticles: [],
			searchPhrase: '',
		}
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

	render() {
		return (
         <div>
            <Typography>WIP RIGHT HERE</Typography>
            <EntityCard />           
         </div>
		)
	};
}

export default SearchListGroupedByEntity;
