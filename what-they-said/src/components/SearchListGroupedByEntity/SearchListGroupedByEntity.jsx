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
         sortedEntityArticleGroupingsArray: props.sortedEntityArticleGroupingsArray,
         searchPhrase: props.searchPhrase,
         // _setIframeUrl: props._setIframeUrl
      }
   }

   componentDidMount() {
      this.setState({
         searchPhrase: this.props.searchPhrase,
         sortedEntityArticleGroupingsArray: this.props.sortedEntityArticleGroupingsArray,
         // _setIframeUrl: this.props._setIframeUrl
      });
   }

   componentDidUpdate() {
      if (this.props.sortedEntityArticleGroupingsArray !== this.state.sortedEntityArticleGroupingsArray) {
         //console.log("Search list component", this.props.entityArticleGroupings);
         this.setState({
            searchPhrase: this.props.searchPhrase,
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
                        key={`${entityElem.entity}-${index}-${entityElem.publish_date}-${entityElem.title}`} 
                        SingleEntityMap={entityElem}
                        // _setIframeUrl={this.state._setIframeUrl}
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
