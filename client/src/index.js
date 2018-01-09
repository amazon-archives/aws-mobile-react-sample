/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Link, Switch } from 'react-router-dom';
import { Button, Card, Row, Col, Navbar, NavItem, Icon } from 'react-materialize';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Main from './Main';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Forget from './Auth/Forget';
import awsmobile from './aws-exports';
import Amplify,{Auth} from 'aws-amplify';
import './css/general.css';

Amplify.configure(awsmobile);

require('file-loader?name=[name].[ext]!./index.html');
require("babel-core/register");
require("babel-polyfill");

const PublicRoute = ({ component: Component, authStatus, ...rest}) => (
    <Route {...rest} render={props => authStatus == false
        ? ( <Component {...props} /> ) : (<Redirect to="/main" />)
    } />
)

const PrivateRoute = ({ component: Component, authStatus, ...rest}) => (
    <Route {...rest} render={props => authStatus == false
        ? ( <Redirect to="/login" /> ) : ( <Component {...props} /> )
    } />
)

export default class AppRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {authStatus: this.props.authStatus || false}
        this.handleWindowClose = this.handleWindowClose.bind(this);
    }

    handleWindowClose = async (e) => {
        e.preventDefault();
        Auth.signOut()
            .then(
                sessionStorage.setItem('isLoggedIn', false),
                this.setState(() => {
                    return {
                        authStatus: false
                    }
                })
            )
            .catch(err => console.log(err))
    }

    componentWillMount() {
        this.validateUserSession();
        window.addEventListener('beforeunload', this.handleWindowClose);
    }

    componentWillUnMount() {
        window.removeEventListener('beforeunload', this.handleWindowClose);
    }

    validateUserSession() {
        let checkIfLoggedIn = sessionStorage.getItem('isLoggedIn');
        if(checkIfLoggedIn === 'true'){
            this.setState(() => {
                return {
                    authStatus: true
                }
            })
        } else {
            this.setState(() => {
                return {
                    authStatus: false
                }
            })
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <PublicRoute authStatus={this.state.authStatus} path='/' exact component={Login} />
                    <PublicRoute authStatus={this.state.authStatus} path='/login' exact component={Login} />
                    <PublicRoute authStatus={this.state.authStatus} path='/register' exact component={Register} />
                    <PublicRoute authStatus={this.state.authStatus} path='/forget' exact component={Forget} />
                    <PrivateRoute authStatus={this.state.authStatus} path='/main' component={Main} />
                    <Route render={() => (<Redirect to="/login" />)} />
                </Switch>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<AppRoute />, document.getElementById('root'));
