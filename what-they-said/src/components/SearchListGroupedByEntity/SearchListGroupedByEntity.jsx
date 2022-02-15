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
import demo7JSON from '../../test_data/demo7.json';

class SearchListGroupedByEntity extends React.Component {
	constructor(props) {
		super(props);
      console.log(demo7JSON);
		this.state = {
         articles: demo7JSON,
			filteredArticles: [],
			searchPhrase: '',
		}
	}

	componentDidMount() {
   ////todo: fetch from backend, whether a json or an API
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
            <EntityCard />           
            <EntityCard />                
         </div>
		)
	};
}

export default SearchListGroupedByEntity;
