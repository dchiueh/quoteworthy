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

const displayEntitySingleArticleCard = (SingleEntityMapElem) => {
   return (
   <a href={SingleEntityMapElem.url} style={{ textDecoration: "none" }} target="_blank">
      <CardContent>
         <div style={{ border: "solid #a5a58d 3px", borderRadius: "15px", backgroundColor:"white"}}>
            <div className="header">
               
               <Typography variant="h6" color="black" style={{flexGrow: 1, fontWeight: "bold", padding: "0px 9px"}}>
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

            {SingleEntityMapElem.quotes.map((quoteMap, index) => {
               if (!quoteMap.context) {
                  return <div className="quoteWrapper">
                     <Typography  className="quote" style={{color: "blue"}}>
                        "{quoteMap.quote}"
                     </Typography>
                     <Typography style={{paddingLeft:5, flexShrink: 0}}> Context ></Typography>
                  </div>
               } else {
                  return <div className="quoteWrapper"> 
                     <Typography className="quote" style={{color:"black"}}>
                        {quoteMap.context}
                     </Typography>
                     <Typography style={{paddingLeft:5, flexShrink: 0}}> Context ></Typography>
                   </div>
               }
            })}
         </div>
      </CardContent>
   </a>
   )
}


const EntityCard = ({ SingleEntityMap }) => {
   const [expanded, setExpanded] = React.useState(false);

   const handleExpandClick = () => {
      setExpanded(!expanded);
   };

   console.log("single entity map", SingleEntityMap);

   //todo: return a mapping of all the single article card links to the external site
   //guaranteed at least 1 article card if there's an entity
   return (
      <Card sx={{ border: "solid grey 1px", paddingBottom: "12px" }}>
         <Typography variant="h5" style={{ fontWeight:"bold", paddingTop: "12px" }}>
            {SingleEntityMap[0].entity}
         </Typography>
         <Typography style={{ fontSize: 16 }}>{SingleEntityMap.length} matching article{SingleEntityMap.length > 1 ? "s" : ""}</Typography>

         {displayEntitySingleArticleCard(SingleEntityMap[0])}

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
               <Typography style={{ fontSize: 16 }}>See more </Typography>
               <ExpandMoreIcon />
            </ExpandMore>}
         </CardActions>
         <Collapse in={expanded} timeout="auto" unmountOnExit>
            {SingleEntityMap[1] &&
               SingleEntityMap.slice(1).map((SingleEntityMapElem => {
                  return displayEntitySingleArticleCard(SingleEntityMapElem);
               }))
            } 
         </Collapse>
      </Card>
   )
}

export default EntityCard;
