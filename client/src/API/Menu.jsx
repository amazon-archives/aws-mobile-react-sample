/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import './../css/general.css';

export default class Menu extends Component{

    state = {
        myTableData: []
    }

    componentWillMount() {
        sessionStorage.getItem('currentRestaurantId') ? this.fetchMenuList() : false;
    }

    fetchMenuList = async () => {
        API.get('ReactSample','/items/restaurants/'+ sessionStorage.getItem('currentRestaurantId') + '/menu')
            .then(data => {
                console.log(data);
                this.setState({
                    myTableData: data
                });
                return data;
            })
            .catch ( err => console.log(err))
    }

    orderItem = async (restaurantId,itemId) => {
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'restaurant_id': restaurantId,
                'menu_items': [{
                    'id':itemId,
                    'quantity': 1
                }]
            }
        }
        
        API.post('ReactSample','/items/orders', requestParams)
            .then(data => {
                sessionStorage.setItem('latestOrder', data.id);
                console.log(data);
                alert('Ordered successfully');
            })
            .catch (err => console.log(err))
    }

    render() {
        const currentRestaurant = sessionStorage.getItem('currentRestaurant');
        console.log(currentRestaurant);
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
                <h4>{currentRestaurant ? 'Click below to order an item from ' + currentRestaurant : 'Please select one restaurant' }</h4>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Item Name</Table.HeaderCell>
                            <Table.HeaderCell>Order</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        { this.state.myTableData && this.state.myTableData.map((data, i) =>
                        <Table.Row key={data.id}>
                            <Table.Cell>{data.name}</Table.Cell>
                            <Table.Cell>{data.description}</Table.Cell>
                            <Table.Cell><Button primary onClick={this.orderItem.bind(this, data.restaurant_id, data.id)}>Order</Button></Table.Cell>
                        </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
            </CSSTransitionGroup>
        );
    }
}
