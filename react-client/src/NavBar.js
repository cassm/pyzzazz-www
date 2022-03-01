import React from 'react';
import {useState} from "react";
import {Link} from "react-router-dom";
import Logo from './logo.js';

import './NavBar.css';

const getCurrentPage = () => {
  if (window.location.pathname === '/') {
    return '/status';
  } else {
    return window.location.pathname;
  }
}


const NavBar = () => {
  const [active, setActive] = useState(getCurrentPage());

  const links = ['status', 'configuration', 'control', 'visualiser'].map(pageName => {
    const linkName = '/'+pageName;
    const className = `NavLink ${active === linkName ? 'active' : ''}`

    const updateActive = () => {
      setActive(linkName);
    }

    return (
      <Link to={linkName} className={className} onClick={updateActive} key={`navLink${pageName}`}>{pageName}</Link>
    )
  })

  return (
    <div className="NavBar">
      <div className="Splash">
        <Logo size="62.5" darkMode={true} key="navLogo"/>
        <p className="Title">PYZZAZZ</p>
      </div>
      <div className="Nav">
        {links}
      </div>
    </div>
  );
}

export default NavBar;