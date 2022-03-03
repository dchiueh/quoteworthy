import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import ReactDOM from 'react-dom';

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
  Collapse,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';

import HomeScreen from './screens/Home';
import SearchListGroupedByEntity from './components/SearchListGroupedByEntity/SearchListGroupedByEntity';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// import {
//   BrowserRouter as Router, Route, Link, Switch
// } from 'react-router-dom';

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

function App() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box className="Quoteworthy Application" sx={{margin: "auto", textAlign: "center"}}>
      <header style={{textAlign: "center"}}>
        <h1 style={{fontFamily: 'Chomsky', fontSize:"60px", fontWeight:"200", marginBottom:"0", paddingBottom:"0", marginTop:"20px", letterSpacing: "-0.5px"}}>Quoteworthy </h1>
        <p style={{marginTop:"10px"}}>Search our archive of <i>New York Times</i> articles by keyword to find relevant quotes sorted by speaker.</p> 
      </header>
            
      <HomeScreen />
      {/*TODO: fix code so we handle state a hell of a lot better */}
      <p>Accessibility Caption: We present quoteworthy, a tool that extract quotes from an archive of 600 articles from the New York Times from 2018-2020. There is a search tool at the top that lets a user query based on keyword, and then relevant and correctly attributed quotes from our archive will populate. Filters by date and location are included as well. </p>
    </Box>
  );
}

export default App;
