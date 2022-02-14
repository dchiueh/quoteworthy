import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import ReactDOM from 'react-dom';

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

import SearchBox from './components/SearchBox/SearchBox.jsx';

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
    <div className="App">
      <header><h1>What They Said</h1></header>
      
      <h1 className="header">Quoteworthy</h1>
      
      <SearchBox />

    <Card sx={{ border: "solid grey 1px"}}>
      <CardHeader
        // avatar={
        //   <Avatar sx={{ backgroundColor: "skyblue" }} aria-label="article-count">
        //     3
        //   </Avatar>
        // }
        title={
          <Typography style={{fontSize: 24}}>
             Santa Clara Office
          </Typography>
          }
        // subheader="2015-2020"
        style={{ padding: 8, display: 'inline' }}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardContent>
        {/**TODO: decompose hardcoded "first card preview" and nested cards as own article bundles of quotes components */}
        <div style={{border: "solid grey 0.5px", borderRadius: "15px"}}>
          <Typography variant="h5" color="black">
            Example article title
          </Typography>

          <Typography style={{fontSize: 16}}>
            "This is an example quote"
          </Typography>
     
        </div>
      </CardContent>

      <CardActions disableSpacing>
          <Avatar sx={{ backgroundColor: "skyblue" }} aria-label="article-count">
            3
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
          <Typography style={{fontSize: 20}}>See more </Typography>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/**TODO: decompose hardcoded "first card preview" and nested cards as own article bundles of quotes components */}
          <div style={{border: "solid grey 0.5px", borderRadius: "15px"}}>
            <Typography variant="h5" color="black">
              Example article title
            </Typography>

            <Typography style={{fontSize: 16}}>
              "This is an example quote"
            </Typography>
      
          </div>
        </CardContent>
        <CardContent>
          {/**TODO: decompose hardcoded "first card preview" and nested cards as own article bundles of quotes components */}
          <div style={{border: "solid grey 0.5px", borderRadius: "15px"}}>
            <Typography variant="h5" color="black">
              Example article title
            </Typography>

            <Typography style={{fontSize: 16}}>
              "This is an example quote"
            </Typography>
      
          </div>
        </CardContent>
      </Collapse>
    </Card>


{/* 
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
