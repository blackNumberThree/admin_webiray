import React, { Component } from 'react';
import './App.css';
import Main from './components/main.js';
import Blanck from './components/blanck.js';
import Authorization from './components/authorization.js';

import {HashRouter as Router,  Route} from 'react-router-dom';


class App extends Component{
  state = {
    displayPage : this.page
  }
  page = (sessionStorage.getItem('securety'))?Main:Authorization;

  render(){
    return(
      <Router>
          <Route exact path="/" component = {this.page}/> 
          <Route path= "/blanck"   component = {Blanck}/>
      </Router>
    );
  }}
export default App 

