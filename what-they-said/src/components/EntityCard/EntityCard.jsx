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

import EntitySingleArticleCard from '../EntitySingleArticleCard/EntitySingleArticleCard';

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
         <div style={{ border: "solid grey 0.5px", borderRadius: "15px" }}>
            <div style={{ textAlign: "right", marginRight: "10px" }}>
               <Typography style={{ fontSize: 13, color: "grey" }}>
                  {SingleEntityMapElem.publish_date}
               </Typography>
               <Typography style={{ fontSize: 13, color: "grey" }}>
                  {SingleEntityMapElem.slug}
               </Typography>
            </div>
            <Typography variant="h6" color="black">
               {SingleEntityMapElem.title}
            </Typography>

            {SingleEntityMapElem.quotes.map((quoteMap, index) => {
               let display;
               if (!quoteMap.context) {
                 display = quoteMap.quote;
               } else {
                 display = quoteMap.context;
               }
               return <div className="cardContent">
                  <Typography className="quote" style={{textAlign: "left"}}>
                     "{display}"
                     {/* Kinda unsure about this because we only want to put quotes where it's a quote?
                     How to do it with conditional rendering?*/}
                  </Typography>
               </div>
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
         <Typography style={{ fontSize: 20, fontWeight: "bold", paddingTop: "12px" }}>
            {SingleEntityMap[0].entity}
         </Typography>
         {displayEntitySingleArticleCard(SingleEntityMap[0])}

         <CardActions disableSpacing>
            {/* <Avatar sx={{ backgroundColor: "skyblue" }} aria-label="article-count">
               {SingleEntityMap.length}
            </Avatar> */}
            <Typography style={{ fontSize: 16 }}>Appears in {SingleEntityMap.length} article{SingleEntityMap.length > 1 ? "s" : ""}</Typography>

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
