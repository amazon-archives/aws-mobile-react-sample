/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var uuid = require('node-uuid')
var putCallback = function(err, data) {
    if (err) {
        console.log(err)
    }
}

const MENU_TABLE_NAME = process.env.MENU_TABLE_NAME;
const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;
const RESTAURANTS_TABLE_NAME = process.env.RESTAURANTS_TABLE_NAME;

function initData(dynamoDb) {
    createRestaurant(dynamoDb, {
        id: uuid.v1(),
        name: "Euclid’s Chicken and Gravy",
        address: "9372 GCD 229, Round Rock, TX 73829",
        phone: "(512) 351-9724",
        rating: 4.6
    })

    createRestaurant(dynamoDb, {
        id: uuid.v1(),
        name: "Descartes Bar + Kitchen",
        address: "1596 Cartesian Blvd, Austin, TX 03928",
        phone: "(512) 836-5700",
        rating: 4.5
    })

    createRestaurant(dynamoDb, {
        id: uuid.v1(),
        name: "Fermat’s Poke",
        address: "1640 Last Way, Dallas, TX 02391",
        phone: "n/a",
        rating: 4.4
    })

    createRestaurant(dynamoDb, {
        id: uuid.v1(),
        name: "Euler’s Classic Cooking",
        address: "1851 Series Street, Dallas, TX 02938",
        phone: "(512) 323-0153",
        rating: 4.3
    })

    createRestaurant(dynamoDb, {
        id: uuid.v1(),
        name: "Euclidian Eats",
        address: "2 Cosets Ave, Austin, TX, 02981",
        phone: "(512) 293-6118",
        rating: 4.2
    })
}

function createRestaurant(dynamoDb, restaurant) {
    dynamoDb.put({
        Item: restaurant,
        TableName: RESTAURANTS_TABLE_NAME
    }, (err, data) => {
        putCallback(err, data)
        createMenus(dynamoDb, restaurant.id)
    })
}

function createMenus(dynamoDb, restaurant_id) {
    createMenuItem(dynamoDb, {
        restaurant_id,
        name: "Golden Ratio Bacon Skewers",
        description: "Fibonacci on a stick! Who doesn’t like bacon on a stick that keeps going?"
    })

    createMenuItem(dynamoDb, {
        restaurant_id,
        name: "Abelian Cucumber Salad",
        description: "A cool and refreshing salad for any hot summer day"
    })

    createMenuItem(dynamoDb, {
        restaurant_id,
        name: "Chili-Cucumber orientable Corn",
        description: "Feel like you’re connected to nature with corn that wraps around your belly."
    })

    createMenuItem(dynamoDb, {
        restaurant_id,
        name: "Finite Short-Rib Fields",
        description: "No utensils! BBQ is finger food!"
    })

    createMenuItem(dynamoDb, {
        restaurant_id,
        name: "Easy Fractal Salad",
        description: "This symmetric pasta salad features feta, artichoke hearts, and kale."
    })
}

function createMenuItem(dynamoDb, { restaurant_id, name, description }) {
    var menuItem = {
        id: uuid.v1(),
        restaurant_id,
        name,
        description,
        photos: []
    }

    dynamoDb.put({
        Item: menuItem,
        TableName: MENU_TABLE_NAME
    }, putCallback)
}

exports.init = initData
