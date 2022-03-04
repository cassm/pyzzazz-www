import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Routes} from 'react-router-dom';
import {useEffect, useState} from 'react';
import NavBar from './NavBar.js';
import Configuration from './Configuration.js';
import Control from './Control.js';
import Status from './Status.js';
import Visualiser from './Visualiser.js';

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
        <div className="Container">
        <NavBar className="NavBar"/>
          <Routes class="PageBody">
            <Route path="/configuration" element={<Configuration/>}/>
            <Route path="/control" element={<Control/>}/>
            <Route path={"/status"} element={<Status coords={coords} fixtures={fixtures} loading={loading}/>}/>
            <Route path={"/"} element={<Status coords={coords} fixtures={fixtures} loading={loading}/>}/>
            <Route path="/visualiser" element={<Visualiser coords={coords} loading={loading}/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
