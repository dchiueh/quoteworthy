import React from 'react';

import { styled } from '@mui/material/styles';

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

const EntityCard = ({ entityInfo }) => {
   const [expanded, setExpanded] = React.useState(false);

   const handleExpandClick = () => {
      setExpanded(!expanded);
   };

   return (
      <Card sx={{ border: "solid grey 1px", paddingBottom: "12px" }}>
         {/* <CardHeader
            title={
               <Typography style={{ fontSize: 24, fontWeight: "bold" }}>
                  {entityInfo.name}
               </Typography>
            }
            // subtitle={
            //    <Typography style={{ fontSize: 18, color: "grey"}}>
            //       Former contexts: {entityInfo.profession}
            //    </Typography>
            // }
            style={{ padding: 8, display: 'inline' }}
         /> */}
         {/* <CardMedia
         component="img"
         height="194"
         image="/static/images/cards/paella.jpg"
         alt="Paella dish"
      /> */}
         <Typography style={{ fontSize: 24, fontWeight: "bold", paddingTop: "12px" }}>
            {entityInfo.name}
         </Typography>
         <Typography style={{ fontSize: 18, color: "grey" }}>
            Prior contexts: {entityInfo.profession}
         </Typography>
         <a href={entityInfo.articles[0].link} style={{ textDecoration: "none" }} target="_blank">
            <CardContent>
               {/**TODO: decompose hardcoded "first card preview" and nested cards as own article bundles of quotes components */}
               {/* <EntitySingleArticleCard articleInfo={{}}/> */}

               <div style={{ border: "solid grey 0.5px", borderRadius: "15px" }}>
                  <div style={{ textAlign: "right", marginRight: "10px" }}>
                     <Typography style={{ fontSize: 13, color: "grey" }}>
                        {entityInfo.articles[0].time}
                     </Typography>
                  </div>
                  <Typography variant="h6" color="black">
                     {entityInfo.articles[0].title}
                  </Typography>

                  <Typography style={{ fontSize: 16 }}>
                     "{entityInfo.articles[0].quotes[0]}"
                  </Typography>

               </div>
            </CardContent>
         </a>
         <CardActions disableSpacing>
            <Avatar sx={{ backgroundColor: "skyblue" }} aria-label="article-count">
               {entityInfo.articles.length}
            </Avatar>
            <IconButton aria-label="add to favorites">
               <FavoriteIcon />
            </IconButton>
            <ExpandMore
               expand={expanded}
               onClick={handleExpandClick}
               aria-expanded={expanded}
               aria-label="show more"
            >
               <Typography style={{ fontSize: 16 }}>See more </Typography>
               <ExpandMoreIcon />
            </ExpandMore>
         </CardActions>
         <Collapse in={expanded} timeout="auto" unmountOnExit>
            {entityInfo.articles[1] &&
               <CardContent>
                  {/**TODO: decompose hardcoded "first card preview" and nested cards as own article bundles of quotes components */}
                  <div style={{ border: "solid grey 0.5px", borderRadius: "15px" }}>
                     <div style={{ textAlign: "right", marginRight: "10px" }}>
                        <Typography style={{ fontSize: 13, color: "grey" }}>
                           {entityInfo.articles[1].time}
                        </Typography>
                     </div>
                     <Typography variant="h6" color="black">
                        {entityInfo.articles[1].title}
                     </Typography>

                     <Typography style={{ fontSize: 16 }}>
                        "{entityInfo.articles[1].quotes[0]}"
                     </Typography>

                  </div>
               </CardContent>
            }
            {entityInfo.articles[2] &&
               <CardContent>
                  {/**TODO: decompose hardcoded "first card preview" and nested cards as own article bundles of quotes components */}
                  <div style={{ border: "solid grey 0.5px", borderRadius: "15px" }}>
                     <div style={{ textAlign: "right", marginRight: "10px" }}>
                        <Typography style={{ fontSize: 13, color: "grey" }}>
                           {entityInfo.articles[2].time}
                        </Typography>
                     </div>
                     <Typography variant="h6" color="black">
                        {entityInfo.articles[2].title}
                     </Typography>

                     <Typography style={{ fontSize: 16 }}>
                        "{entityInfo.articles[2].quotes[0]}"
                     </Typography>

                  </div>
               </CardContent>
            }

         </Collapse>
      </Card>
   )
}

export default EntityCard;
