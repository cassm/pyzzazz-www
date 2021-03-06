import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Routes} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import ResponsiveAppBar from './ResponsiveAppBar.js';
import Configuration from './Configuration.js';
import ControlDrawer from './ControlDrawer.js';
import Status from './Status.js';
import Visualiser from './Visualiser.js';
import {theme} from './common/theme'

import './App.css';
import Box from "@mui/material/Box";


function App() {
  const [coords, setCoords] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getResources() {
      async function fetchResource(resource) {
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
    <Box height='100%' sx={{display: 'flex', flexDirection: 'column'}}>
      <Router>
        <ThemeProvider theme={theme}>
          <ResponsiveAppBar/>
          <Box mt={8} ml={3} sx={{zIndex: 1250, position: 'fixed'}}>
            <ControlDrawer />
          </Box>
          <Box sx={{flexGrow: 2, display: 'flex', alignItems: 'center', flexDirection: 'column', zIndex: 1249}}>
            <Routes class="PageBody">
              <Route path="/configuration" element={<Configuration/>}/>
              <Route path={"/status"} element={<Status coords={coords} fixtures={fixtures} loading={loading}/>}/>
              <Route path={"/"} element={<Status coords={coords} fixtures={fixtures} loading={loading}/>}/>
              <Route path="/visualiser" element={<Visualiser coords={coords} loading={loading}/>}/>
            </Routes>
          </Box>
        </ThemeProvider>
      </Router>
    </Box>
  );
}

export default App;
