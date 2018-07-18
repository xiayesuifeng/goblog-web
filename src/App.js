import React, { Component } from 'react';
import './index.css';
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Article from './pages/Article'
import ArticleEditor from './pages/ArticleEditor'
import {CssBaseline} from "@material-ui/core/index.es";
import {Route, Switch} from "react-router-dom";

class App extends Component {
  render() {
    return (
        <div className="App">
            <CssBaseline />
            <Switch>
                <Route path="/admin" component={Admin}/>
                <Route path="/login" component={Login}/>
                <Route path="/article/:id" component={Article}/>
                <Route path="/articleEditor/:id" component={ArticleEditor}/>
                <Route path="/articleEditor" component={ArticleEditor}/>
                <Route path="/:type/:id" component={Home}/>
                <Route path="/" component={Home}/>
            </Switch>
        </div>
    );
  }
}

export default App;
