import './App.css';
import * as React from 'react';

import { 
  Box,
  Card,
} from '@mui/material';

import HomeScreen from './screens/Home';

function App() {
  return (
    <Box className="Quoteworthy by Team What They Said" sx={{margin: "auto", textAlign: "center"}}>
      <header style={{textAlign: "center"}}>
        <h1 style={{fontFamily: 'Chomsky', fontSize:"60px", fontWeight:"200", marginBottom:"0", paddingBottom:"0", marginTop:"20px", letterSpacing: "-0.5px"}}>Quoteworthy </h1>
        <p style={{marginTop:"10px", fontSize: "16px"}}>Search our archive of <i>New York Times</i> articles by keyword to find relevant quotes sorted by speaker.</p> 
      </header>
            
      <HomeScreen />
      <Card style={{border: "0.5px solid #7f7f7f", fontSize: "16px"}}>
        <p>
          Our team presents Quoteworthy, a tool that extract quotes from an archive of 600 articles from the New York Times from 2018-2020. 
        </p>
        <p>
          Search by keywords and filter by date and location, and relevant and correctly attributed quotes from our archive will populate. 
          You can also enter keywords separated by comma for a more in-depth search.
        </p>

        <p>
          By: Alex H, Dana C, Jennah H, Misato N, Shana H 
        </p>
      </Card>
    </Box>
  );
}

export default App;
