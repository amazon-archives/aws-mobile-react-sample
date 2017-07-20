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

function createMenu(dynamoDb, restaurant_id) {
    var item1 = {}
    item1.id = uuid.v1()
    item1.restaurant_id = restaurant_id
    item1.name = "Golden Ratio Bacon Skewers"
    item1.description = "Fibonacci on a stick! Who doesn’t like bacon on a stick that keeps going?"
    item1.photos = []
    dynamoDb.put({
        Item: item1,
        TableName: MENU_TABLE_NAME
    }, putCallback)
    var item2 = {}
    item2.id = uuid.v1()
    item2.restaurant_id = restaurant_id
    item2.name = "Abelian Cucumber Salad"
    item2.description = "A cool and refreshing salad for any hot summer day."
    item2.photos = []
    dynamoDb.put({
        Item: item2,
        TableName: MENU_TABLE_NAME
    }, putCallback)
    var item3 = {}
    item3.id = uuid.v1()
    item3.restaurant_id = restaurant_id
    item3.name = "Chili-Cucumber orientable Corn"
    item3.description = "Feel like you’re connected to nature with corn that wraps around your belly."
    item3.photos = []
    dynamoDb.put({
        Item: item3,
        TableName: MENU_TABLE_NAME
    }, putCallback)
    var item4 = {}
    item4.id = uuid.v1()
    item4.restaurant_id = restaurant_id
    item4.name = "Finite Short-Rib Fields"
    item4.description = "No utensils! BBQ is finger food!"
    item4.photos = []
    dynamoDb.put({
        Item: item4,
        TableName: MENU_TABLE_NAME
    }, putCallback)
    var item5 = {}
    item5.id = uuid.v1()
    item5.restaurant_id = restaurant_id
    item5.name = "Easy Fractal Salad"
    item5.description = "This symmetric pasta salad features feta, artichoke hearts, and kale."
    item5.photos = []
    dynamoDb.put({
        Item: item5,
        TableName: MENU_TABLE_NAME
    }, putCallback)
}

function initData(dynamoDb) {
    var restaurant1 = {}
    restaurant1.id = uuid.v1()
    restaurant1.name = "Euclid’s Chicken and Gravy"
    restaurant1.address = "9372 GCD 229, Round Rock, TX 73829"
    restaurant1.phone = "(512) 351-9724"
    restaurant1.rating = 4.6
    dynamoDb.put({
        Item: restaurant1,
        TableName: RESTAURANTS_TABLE_NAME
    }, putCallback)
    createMenu(dynamoDb, restaurant1.id)

    var restaurant2 = {}
    restaurant2.id = uuid.v1()
    restaurant2.name = "Descartes Bar + Kitchen"
    restaurant2.address = "1596 Cartesian Blvd, Austin, TX 03928"
    restaurant2.phone = "(512) 836-5700"
    restaurant2.rating = 4.5
    dynamoDb.put({
        Item: restaurant2,
        TableName: RESTAURANTS_TABLE_NAME
    }, putCallback)
    createMenu(dynamoDb, restaurant2.id)

    var restaurant3 = {}
    restaurant3.id = uuid.v1()
    restaurant3.name = "Fermat’s Poke"
    restaurant3.address = "1640 Last Way, Dallas, TX 02391"
    restaurant3.phone = "n/a"
    restaurant3.rating = 4.4
    dynamoDb.put({
        Item: restaurant3,
        TableName: RESTAURANTS_TABLE_NAME
    }, putCallback)
    createMenu(dynamoDb, restaurant3.id)

    var restaurant4 = {}
    restaurant4.id = uuid.v1()
    restaurant4.name = "Euler’s Classic Cooking"
    restaurant4.address = "1851 Series Street, Dallas, TX 02938"
    restaurant4.phone = "(512) 323-0153"
    restaurant4.rating = 4.3
    dynamoDb.put({
        Item: restaurant4,
        TableName: RESTAURANTS_TABLE_NAME
    }, putCallback)
    createMenu(dynamoDb, restaurant4.id)

    var restaurant5 = {}
    restaurant5.id = uuid.v1()
    restaurant5.name = "Euclidian Eats"
    restaurant5.address = "2 Cosets Ave, Austin, TX, 02981"
    restaurant5.phone = "(512) 293-6118"
    restaurant5.rating = 4.2
    dynamoDb.put({
        Item: restaurant5,
        TableName: RESTAURANTS_TABLE_NAME
    }, putCallback)
    createMenu(dynamoDb, restaurant5.id)
}

exports.init = initData
