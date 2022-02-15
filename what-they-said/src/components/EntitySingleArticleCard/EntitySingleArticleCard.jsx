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

// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

// const ExpandMore = styled((props) => {
//    const { expand, ...other } = props;
//    return <IconButton {...other} />;
//  })(({ theme, expand }) => ({
//    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//    marginLeft: 'auto',
//    transition: theme.transitions.create('transform', {
//      duration: theme.transitions.duration.shortest,
//    }),
//  }));

const EntitySingleArticleCard = (articleInfo) => {
   let articleTitle = true;
   let articleQuote = true;
   // const [expanded, setExpanded] = React.useState(false);

   // const handleExpandClick = () => {
   //   setExpanded(!expanded);
   // };

   return (
      <div style={{border: "solid grey 0.5px", borderRadius: "15px"}}>
         {articleTitle && 
            (<Typography variant="h6" color="black">
               Example article title
            </Typography>)
         }
         {articleQuote && 
            (<Typography style={{fontSize: 16}}>
               "This is an example quote This is an example quote This is an example quote This is an example quote This is an example quote This is an example quote This is an example quote This is an example quote This is an example quote"
            </Typography>)
         }
      </div>
   )
}

export default EntitySingleArticleCard;
