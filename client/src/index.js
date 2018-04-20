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
import awsmobile from './aws-exports';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import './css/general.css';

Amplify.configure(awsmobile);

require('file-loader?name=[name].[ext]!./index.html');
require("babel-core/register");
require("babel-polyfill");

const MainRoute = ({ component: Component, ...rest}) => (
    <Route {...rest} render={props => ( <Component {...props} /> )} />
)

const federated = {
    google_client_id: '503978479551-2dcdvm02ae6901g02to7j4d1g37jmlcq.apps.googleusercontent.com',
    facebook_app_id: '2',
    amazon_client_id: 'amzn1.application.df9258f39cc54be7a9ff65db331c4475'
};

class App extends Component {

    constructor(props) {
        super(props);
    }

    handleWindowClose = async (e) => {
        e.preventDefault();
        Auth.signOut()
            .then()
            .catch(err => console.log(err))
    }

    componentWillMount() {
        window.addEventListener('beforeunload', this.handleWindowClose);
    }

    componentWillUnMount() {
        window.removeEventListener('beforeunload', this.handleWindowClose);
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <MainRoute path='/' exact component={Main} />
                </Switch>
            </BrowserRouter>
        );
    }
}

const AppWithAuth = withAuthenticator(App)

ReactDOM.render(<AppWithAuth federated={federated}/>, document.getElementById('root'));
