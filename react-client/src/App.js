import logo from './logo.svg';
import { Logo } from './logo.js';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo width={300} height={300} strokeWidth={10} />
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
    </div>
  );
}

export default App;
