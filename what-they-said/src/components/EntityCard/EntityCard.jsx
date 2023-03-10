import React from 'react';

import { styled } from '@mui/material/styles';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

import './EntityCard.css';

import {
   Avatar,
   Card,
   CardContent,
   CardActions,
   Collapse,
   IconButton,
   Typography
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExpandMore = styled((props) => {
   const { expand, ...other } = props;
   return <IconButton {...other} />;
})(({ theme, expand }) => ({
   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
   marginLeft: 'auto',
   transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
   }),
}));

const displayEntitySingleArticleCard = (SingleEntityMapElem) => {
   return (
      <CardContent 
         key={`${SingleEntityMapElem.entity}-${SingleEntityMapElem.title}`}
      >
         <div style={{ border: "solid #a5a58d 3px", borderRadius: "15px", backgroundColor:"white"}}>
            <a href={SingleEntityMapElem.url} style={{textDecoration: "none"}} target="_blank" rel="noreferrer">
               <div className="header">  
                  <Typography color="black" style={{fontSize:"24px", textAlign: "left", flexGrow: 1, fontWeight: "bold", padding: "0px 9px", fontFamily:"Cheltenham"}}>
                     {SingleEntityMapElem.title}
                  </Typography>
                  <div className="info" style={{ padding:"3px 0px", fontFamily:"Imperial BT", textAlign: "right", marginRight: "10px", fontSize: 13, color: "grey" }}>
                     <Typography style={{fontFamily:"Imperial BT", lineHeight:"18px"}}>
                        {SingleEntityMapElem.publish_date}
                     </Typography>
                     <Typography style={{fontFamily:"Imperial BT", lineHeight:"18px"}}>
                        {SingleEntityMapElem.slug}
                     </Typography>
                     <Typography style={{fontFamily:"Imperial BT", lineHeight:"18px"}}>
                  {`${SingleEntityMapElem.quotes.length} quote${SingleEntityMapElem.quotes.length > 1 ? "s" : ""}`}
                  </Typography>
                  <Typography style={{color:"blue", fontFamily:"Imperial BT", lineHeight:"18px"}}>
                  Read full article {'>'}
                  </Typography>
                  </div> 
               </div>
            </a>
               {SingleEntityMapElem.quotes.map((quoteMap, index) => {
                  //let textToShow = quoteMap.context || `"${quoteMap.quote}"`;
                  //This hack is very reliant on the cleanliness of the NLP data pipline (to reduce time for data manipulation)
                  let contextOnlyPart1, contextOnlyPart2 = "";
                  if(quoteMap.context) {
                     let indexToSlice = quoteMap.context.indexOf(`${quoteMap.quote}`) - 1; //to adjust for awk quote characters
                     contextOnlyPart1 = quoteMap.context.slice(0, indexToSlice);
                     contextOnlyPart2 = quoteMap.context.slice(indexToSlice + quoteMap.quote.length + 2); //add 2 for open/end quote
                  }                  
                  return (
                     <a href={`${SingleEntityMapElem.url}#:~:text=${encodeURIComponent(quoteMap.quote)}`} style={{textDecoration: "none"}} target="_blank" rel="noreferrer"
                        key={`${SingleEntityMapElem.entity}-${quoteMap.quote}-${index}`}
                     >
                        <div 
                           className="quoteWrapper"
                           sx={{width: "100%", color: "black", fontSize: "17px", fontFamily: 'Imperial BT', lineHeight:"22px", textTransform: "none"}}                        >
                           <Typography  className="quote" style={{color: "black", fontSize: "17px", fontFamily: 'Imperial BT', lineHeight:"22px", textTransform: "none"}}>
                           <span style={{color: "#7f7f7f"}}>{contextOnlyPart1}</span>
                           {`"${quoteMap.quote}"`}
                           <span style={{color: "#7f7f7f"}}>{contextOnlyPart2}</span>
                           </Typography>
                           <Typography style={{paddingLeft:5, flexShrink: 0, fontFamily: 'Imperial BT', textTransform: "none"}}> Find quote {'>'}</Typography>
                        </div>                                             
                     </a>
                  )
               })}
         </div>
      </CardContent>
   )
}


const EntityCard = ({ SingleEntityMap, _setIframeUrl }) => {
   const [expanded, setExpanded] = React.useState(false);

   const handleExpandClick = () => {
      setExpanded(!expanded);
   };

   //console.log("single entity map", SingleEntityMap);
   return (
      <Card key={`entity-card-whole-${SingleEntityMap[0].entity}-${SingleEntityMap[0].publish_date}-${SingleEntityMap[0].title}`}>
         <div className="nameWrapper">
         <Avatar src="#"> <RecordVoiceOverIcon/> </Avatar>
         <Typography variant="h5" style={{ fontWeight:"bold", fontFamily: 'Imperial BT', padding:"0px 7px" }}>
            {SingleEntityMap[0].entity}
         </Typography>
         <Typography style={{ fontSize: 16, fontFamily:'Imperial BT', alignItems:"center" }}>({SingleEntityMap.length} matching article{SingleEntityMap.length > 1 ? "s" : ""})</Typography>
         </div>
         {displayEntitySingleArticleCard(SingleEntityMap[0], _setIframeUrl)}

         <CardActions disableSpacing>
            {SingleEntityMap[1] && <ExpandMore
               expand={expanded}
               onClick={handleExpandClick}
               aria-expanded={expanded}
               aria-label="show more"
            >
               <Typography style={{ fontSize: 16, fontFamily:'Imperial BT'}}>See more articles </Typography>
               <ExpandMoreIcon />
            </ExpandMore>}
         </CardActions>
         <Collapse in={expanded} timeout="auto" unmountOnExit>
            {SingleEntityMap[1] &&
               SingleEntityMap.slice(1).map((SingleEntityMapElem => {
                  return displayEntitySingleArticleCard(SingleEntityMapElem, _setIframeUrl);
               }))
            } 
         </Collapse>
      </Card>
   )
}

export default EntityCard;
