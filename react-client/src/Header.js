import React from 'react';
import Logo from './logo.js';

import './Header.css';

const Header = () => {

    return (
        <div className="Header">
            <div className="Splash">
                <Logo size="62.5" darkMode={true} />
                <p className="Title">PYZZAZZ</p>
            </div>
            <div className="Nav">
                <p className="NavLink">status</p>
                <p className="NavLink">configure</p>
                <p className="NavLink">control</p>
                <p className="NavLink">visualiser</p>
            </div>
        </div>
    );
}

export default Header;