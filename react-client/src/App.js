import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Routes} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import ResponsiveAppBar from './ResponsiveAppBar.js';
import Configuration from './Configuration.js';
import Control from './Control.js';
import Status from './Status.js';
import Visualiser from './Visualiser.js';
import {theme} from './common/theme'

import './App.css';


function App() {
  const [coords, setCoords] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getResources() {
      async function fetchResource (resource) {
        const res = await fetch(`/resource/${resource}`);
        return await res.json();
      }

      setLoading(true);
      const res_coords = await fetchResource('coords');
      const res_fixtures = await fetchResource('fixtures');

      setCoords(res_coords);
      setFixtures(res_fixtures);
      setLoading(false);
    }

    getResources();
  }, [])

  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <div className="Container">
            <ResponsiveAppBar/>
            <Routes class="PageBody">
              <Route path="/configuration" element={<Configuration/>}/>
              <Route path="/control" element={<Control/>}/>
              <Route path={"/status"} element={<Status coords={coords} fixtures={fixtures} loading={loading}/>}/>
              <Route path={"/"} element={<Status coords={coords} fixtures={fixtures} loading={loading}/>}/>
              <Route path="/visualiser" element={<Visualiser coords={coords} loading={loading}/>}/>
            </Routes>
          </div>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
