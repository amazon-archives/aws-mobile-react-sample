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
import { Authenticator, Greetings } from 'aws-amplify-react';
import './css/general.css';

Amplify.configure(awsmobile);

require('file-loader?name=[name].[ext]!./index.html');
require("babel-core/register");
require("babel-polyfill");


const federated = {
    google_client_id: 'yourGoogleClientID',
    facebook_app_id: 'yourFacebookClientID',
    amazon_client_id: 'yourAmazonClientID'
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
            <Authenticator hide={[Greetings]} federated={federated}>
                <Main  />
            </Authenticator>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));