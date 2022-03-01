import Logo from './logo.js';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './Header.js';
import Configuration from './Configuration.js';
import Control from './Control.js';
import Status from './Status.js';
import Visualiser from './Visualiser.js';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Route path="/configuration">
          <Configuration/>
        </Route>
        <Route path="/control">
          <Control/>
        </Route>
        <Route path="/status">
          <Status/>
        </Route>
        <Route path="/visualiser">
          <Visualiser/>
        </Route>
        <header className="App-header">
          <p id="logo-text">Pyzzazz</p>
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
        </header>
      </Router>
    </div>
  );
}

export default App;
