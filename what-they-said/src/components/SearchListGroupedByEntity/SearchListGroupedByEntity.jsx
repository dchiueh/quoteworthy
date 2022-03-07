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
         sortedEntityArticleGroupingsArray: props.sortedEntityArticleGroupingsArray,
         searchPhrase: props.searchPhrase,
         _setIframeUrl: props._setIframeUrl
      }
   }

   componentDidMount() {
      this.setState({
         searchPhrase: this.props.searchPhrase,
         entityArticleGroupings: this.props.entityArticleGroupings,
         sortedEntityArticleGroupingsArray: this.props.sortedEntityArticleGroupingsArray,
         _setIframeUrl: this.props._setIframeUrl
      });
   }

   componentDidUpdate() {
      if (this.props.searchPhrase !== this.state.searchPhrase) {
         //console.log("Search list component", this.props.entityArticleGroupings);
         this.setState({
            searchPhrase: this.props.searchPhrase,
            entityArticleGroupings: this.props.entityArticleGroupings,
            sortedEntityArticleGroupingsArray: this.props.sortedEntityArticleGroupingsArray,
            //_setIframeUrl: this.props._setIframeUrl
         });
      }
   }

   render() {
      return (
         <div>
         {this.state.sortedEntityArticleGroupingsArray.map((entityElem, index) => {
            return <EntityCard 
                     key={`${entityElem.entity}-${index}-${entityElem.publish_date}`} 
                     SingleEntityMap={entityElem}
                     _setIframeUrl={this.state._setIframeUrl}
                  />
            })
         }
      </div>
         //Object iteration
         // <div>
         //    {Object.keys(this.state.entityArticleGroupings).map((entityName, index) => {
         //       return <EntityCard key={`${entityName}-${index}`} SingleEntityMap={this.state.entityArticleGroupings[entityName]}/>
         //       })
         //    }
         // </div>
      )
   };
}

export default SearchListGroupedByEntity;
