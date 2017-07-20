/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Navbar, NavItem, Icon } from 'react-materialize';
import { Button, Image } from 'semantic-ui-react';

import TableContent from './API/TableContent';
import './css/general.css';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import awsmobile from './configuration/aws-exports';
import aws4 from 'aws4';
import restRequest from './API/restRequestClient'

const cloud_logic_array = JSON.parse(awsmobile.aws_cloud_logic_custom)
const endPoint = cloud_logic_array[0].endpoint;
const apiRestarauntUri = endPoint + '/items/restaurants'
const apiRestarauntInitUri = endPoint + '/items/init';

export default class Home extends Component {

    state = {
        data: [],
        loading: null,
    }

    fetch = () => {
        this.setState(() => {
            return {
                loading: true
            }
        });
        let requestParams = {
            method: 'GET',
            url: apiRestarauntUri
        }
        this.restResponse = restRequest(requestParams)
        .then(data => {
            this.setState({
                data,
                loading: false
            });
        })
        .catch (function(error){
            console.log(error);
        });
    }

    initRestaurant = () => {

        let requestParams = {
            method: 'POST',
            url: apiRestarauntInitUri
        }

        this.restResponse = restRequest(requestParams)
        .then(data => {
            alert('Successfully inserted restaurants');
            this.setState({
                data: data,
                loading: false
            });
        })
        .catch (function(error){
            console.log(error);
        });
    }

    render() {
        console.log('data:' + JSON.stringify(this.state.data));
        return (
            <CSSTransitionGroup
            transitionName="sample-app"
            transitionEnterTimeout={500}
            transitionAppearTimeout={500}
            transitionLeaveTimeout={300}
            transitionAppear={true}
            transitionEnter={true}
            transitionLeave={true}>
            <div className="content">
                <h4>Load your local restaurants with the button below and click the name to view the menu</h4>
                <div className="content-button">
                    <Button primary onClick={this.fetch}>
                        List Restaurants
                    </Button>
                    <Button primary onClick={this.initRestaurant}>
                        Insert Restaurants
                    </Button>
                </div>
                <TableContent tableData={this.state.data} loading={this.state.loading} />
            </div>
            </CSSTransitionGroup>
        );
    }
}
