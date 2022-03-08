import React from 'react';

import EntityCard from '../EntityCard/EntityCard';

class SearchListGroupedByEntity extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         sortedEntityArticleGroupingsArray: props.sortedEntityArticleGroupingsArray,
         searchPhrase: props.searchPhrase,
      }
   }

   componentDidMount() {
      this.setState({
         searchPhrase: this.props.searchPhrase,
         sortedEntityArticleGroupingsArray: this.props.sortedEntityArticleGroupingsArray,
      });
   }

   componentDidUpdate() {
      if (this.props.sortedEntityArticleGroupingsArray !== this.state.sortedEntityArticleGroupingsArray) {
         //console.log("Search list component", this.props.entityArticleGroupings);
         this.setState({
            searchPhrase: this.props.searchPhrase,
            sortedEntityArticleGroupingsArray: this.props.sortedEntityArticleGroupingsArray,
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
