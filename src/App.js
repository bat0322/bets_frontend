import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './screens/Login.js';
import Homescreen from './screens/Homescreen.js';
import EventBetsScreen from './screens/EventBetsScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import UserBetsScreen from './screens/UserBetsScreen.js';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/login'><Login/></Route>
        <Route exact path='/'><Homescreen/></Route>
        <Route path='/profile/:id'><ProfileScreen/></Route>
        <Route path='/event/:id'><EventBetsScreen/></Route>
        <Route path='/bets/:id'><UserBetsScreen/></Route>
      </Switch>
    </Router>
  );
}

export default App;
