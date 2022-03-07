import React from 'react';

import { styled } from '@mui/material/styles';

import './EntityCard.css';

import {
   Avatar,
   Button,
   Card,
   CardHeader,
   CardMedia,
   CardContent,
   CardActions,
   Collapse,
   IconButton,
   Paper,
   TextField,
   Typography
} from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

const displayEntitySingleArticleCard = (SingleEntityMapElem, _setIframeUrl) => {
   return (
   // <a href={SingleEntityMapElem.url} style={{ textDecoration: "none" }} target="_blank">
      <CardContent>
         <div style={{ border: "solid #a5a58d 3px", borderRadius: "15px", backgroundColor:"white"}}>
            <div className="header">
               
               <Typography variant="h5" color="black" style={{textAlign: "left", flexGrow: 1, fontWeight: "bold", padding: "0px 9px", fontFamily:"Cheltenham"}}>
                  {SingleEntityMapElem.title}
               </Typography>
               <div className="info" style={{ textAlign: "right", marginRight: "10px", fontSize: 13, color: "grey" }}>
                  <Typography>
                     {SingleEntityMapElem.publish_date}
                  </Typography>
                  <Typography>
                     {SingleEntityMapElem.slug}
                  </Typography>
                  <Typography>
               {`${SingleEntityMapElem.quotes.length} quote${SingleEntityMapElem.quotes.length > 1 ? "s" : ""}`}
               </Typography>
               </div>
            </div>
            <Button variant="contained" onClick={() => _setIframeUrl(SingleEntityMapElem.url)}>Full article</Button>
            {SingleEntityMapElem.quotes.map((quoteMap, index) => {
               if (!quoteMap.context) {
                  return <div className="quoteWrapper">
                     <Typography  className="quote" style={{color: "black", fontSize: "17px", fontFamily: 'Imperial BT', lineHeight:"22px"}}>
                        "{quoteMap.quote}"
                     </Typography>
                     <Typography style={{paddingLeft:5, flexShrink: 0, fontFamily: 'Imperial BT'}}> Full article {'>'}</Typography>
                  </div>
               } else {
                  return <div className="quoteWrapper"> 
                     <Typography className="quote" style={{color:"#7f7f7f", fontSize: "17px", fontFamily: 'Imperial BT', lineHeight:"22px"}}>
                        {quoteMap.context}
                        {/* Context words are a lighter gray; when the quote is found within the context
                        make the quote black. */}
                     </Typography>
                     <Typography style={{paddingLeft:5, flexShrink: 0, fontFamily: 'Imperial BT'}}> Full article {'>'}</Typography>
                   </div>
               }
            })}
         </div>
      </CardContent>
   // </a>
   )
}


const EntityCard = ({ SingleEntityMap, _setIframeUrl }) => {
   const [expanded, setExpanded] = React.useState(false);

   const handleExpandClick = () => {
      setExpanded(!expanded);
   };

   //console.log("single entity map", SingleEntityMap);

   //todo: return a mapping of all the single article card links to the external site
   //guaranteed at least 1 article card if there's an entity
   return (
      <Card sx={{ border: "solid grey 1px" }}>
         <div className="nameWrapper">
         <Avatar src="#" />
         <Typography variant="h5" style={{ fontWeight:"bold", fontFamily: 'Imperial BT', padding:"0px 7px" }}>
            {SingleEntityMap[0].entity}
         </Typography>
         <Typography style={{ fontSize: 16, fontFamily:'Imperial BT', alignItems:"center" }}>({SingleEntityMap.length} matching article{SingleEntityMap.length > 1 ? "s" : ""})</Typography>
         </div>
         {displayEntitySingleArticleCard(SingleEntityMap[0], _setIframeUrl)}

         <CardActions disableSpacing>
            {/* <Avatar sx={{ backgroundColor: "skyblue" }} aria-label="article-count">
               {SingleEntityMap.length}
            </Avatar> */}
            {SingleEntityMap[1] && <ExpandMore
               expand={expanded}
               onClick={handleExpandClick}
               aria-expanded={expanded}
               aria-label="show more"
            >
               <Typography style={{ fontSize: 16 }}>See more articles </Typography>
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
