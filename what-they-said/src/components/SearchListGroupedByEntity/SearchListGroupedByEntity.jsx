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
         entityArticleGroupings: props.entityArticleGroupings,
         searchPhrase: props.searchPhrase,
      }
   }

   componentDidMount() {
      this.setState({
         searchPhrase: this.props.searchPhrase,
         entityArticleGroupings: this.props.entityArticleGroupings,
      });
   }

   componentDidUpdate() {
      if (this.props.searchPhrase !== this.state.searchPhrase) {
         //console.log("Search list component", this.props.entityArticleGroupings);
         this.setState({
            searchPhrase: this.props.searchPhrase,
            entityArticleGroupings: this.props.entityArticleGroupings,
         });
      }
   }

   render() {
      return (
         <div>
            {Object.keys(this.state.entityArticleGroupings).map((entityName, index) => {
               return <EntityCard key={`${entityName}-${index}`} SingleEntityMap={this.state.entityArticleGroupings[entityName]}/>
               })
            }
         </div>
      )
   };
}

export default SearchListGroupedByEntity;
