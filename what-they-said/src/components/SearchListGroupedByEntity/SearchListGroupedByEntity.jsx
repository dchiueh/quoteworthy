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
// import demo7JSON from '../../test_data/demo7.json';

class SearchListGroupedByEntity extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         entities: [],
         filteredArticles: props.filteredArticles,
         searchPhrase: props.searchPhrase,
      }
   }

   componentDidMount() {


      // console.log("dummy data", demo7JSON);
      // console.log(demo7JSON["Donald J. Trump"].articles[0]);
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

   componentDidUpdate() {
      if (this.props.searchPhrase !== this.state.searchPhrase) {
         //todo: create an efficient search function that can look through a json
         //and find keyword match (it's probably 10ish minutes to do, but I'm tired)

         // let filteredList = this.state.articles.filter(
         //    (article) =>
         //       article.name.includes(this.props.searchPhrase)
         // );

         this.setState({
            searchPhrase: this.props.searchPhrase,
         });
      }
   }

   render() {
      return (
         <div>
            <div>
               {/* <EntityCard entityInfo={this.state.entities["Donald J. Trump"]}/>
               <EntityCard entityInfo={this.state.entities["Alex Conant"]}/> */}
            </div>
         </div>
      )
   };
}

export default SearchListGroupedByEntity;
