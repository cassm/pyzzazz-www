import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Routes} from 'react-router-dom';
import NavBar from './NavBar.js';
import Configuration from './Configuration.js';
import Control from './Control.js';
import Status from './Status.js';
import Visualiser from './Visualiser.js';

import './App.css';


function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/configuration" element={<Configuration/>}/>
          <Route path="/control" element={<Control/>}/>
          <Route path={"/status"} element={<Status/>}/>
          <Route path={"/"} element={<Status/>}/>
          <Route path="/visualiser" element={<Visualiser/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
