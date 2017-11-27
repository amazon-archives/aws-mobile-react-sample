/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Label, List } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {API} from 'aws-amplify';

export default class Order extends Component {

    state = {
        orderId: '',
        quantity: '',
        menuItemName: '',
        itemId: '',
        orderDecription: ''
    }

    componentWillMount() {
        if (sessionStorage.getItem('latestOrder')) {
            this.fetch();
            setTimeout(this.fetchOrderDetails.bind(this), 2000);
        }
    }

    fetch = async () => {
        API.get('ReactSample','/items/orders/' + sessionStorage.getItem('latestOrder'))
            .then(response => {
                const quantity = response.menu_items[0].quantity;
                this.setState({
                    orderId: response.id,
                    quantity: quantity,
                    itemId: response.menu_items[0].id
                })
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchOrderDetails() {
        API.get('ReactSample','/items/restaurants/' + sessionStorage.getItem('currentRestaurantId') + '/menu/' + this.state.itemId)
            .then(response => {
                this.setState({
                    menuItemName: response.name,
                    orderDecription: response.description,
                })
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
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
                    <h4>Your most recent order from {sessionStorage.getItem('currentRestaurant')} is below</h4>
                    <List divided selection>
                        <List.Item>
                            <Label color="purple" horizontal>Order Id</Label>
                            {this.state.orderId}
                        </List.Item>
                        <List.Item>
                            <Label color="purple" horizontal>Item Name</Label>
                            {this.state.menuItemName}
                        </List.Item>
                        <List.Item>
                            <Label color="purple" horizontal>Quantity</Label>
                            {this.state.quantity}
                        </List.Item>
                        <List.Item>
                            <Label color="purple" horizontal>Item Description</Label>
                            {this.state.orderDecription}
                        </List.Item>
                    </List>
                </div>
            </CSSTransitionGroup>
        );
    }
}
