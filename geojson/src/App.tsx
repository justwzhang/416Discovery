import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material';

function App() {
  
  const [geoFile, setGeoFile] = useState<File>();

  async function parseFileToJson(file:File){
    console.log(JSON.parse(await file.text()))

  }

  function handelFile(selectorFiles:FileList){
    setGeoFile(selectorFiles[0])
    parseFileToJson(selectorFiles[0])
    // console.log(geoFile)
  }
  function check(){
    console.log(geoFile);
  }

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <div>
      <Button variant="contained" component="label">
        Upload GeoJson File
        <input hidden accept="file" type="file" onChange={(e)=>handelFile(e.target.files!)}/>
      </Button>
      <Button onClick={()=>check()}>
        Check
      </Button>
    </div>
  );
}

export default App;
