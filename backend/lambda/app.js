/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var AWS = require('aws-sdk')
var uuid = require('node-uuid')

// the init file is only used to populate the database the first time
var init = require('./init.js')

// declare a new express app
var app = express()
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


const MENU_TABLE_NAME = process.env.MENU_TABLE_NAME;
const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;
const RESTAURANTS_TABLE_NAME = process.env.RESTAURANTS_TABLE_NAME;

AWS.config.update({ region: process.env.REGION })

// The DocumentClient class allows us to interact with DynamoDB using normal objects.
// Documentation for the class is available here: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
var dynamoDb = new AWS.DynamoDB.DocumentClient()

/**********************
 * Restaurant methods *
 **********************/

app.get('/items/restaurants', function(req, res) {
    // performs a DynamoDB Scan operation to extract all of the records in the table
    dynamoDb.scan({ TableName: RESTAURANTS_TABLE_NAME }, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load restaurants"
            }).end()
        } else {
            res.json(data['Items'])
        }
    })
})

app.get('/items/restaurants/:restaurantId', function(req, res) {
    // Extracts a specific restaurant from the databsae. If an invalid restaurantId is sent
    // we will returna 400 status code. If the parameter value is valid but we cannot find
    // that restaurant in our database we return a 404
    if (!req.params.restaurantId) {
        res.status(400).json({
            message: "Invalid restaurant ID"
        }).end()
    }
    dynamoDb.get({
        TableName: RESTAURANTS_TABLE_NAME,
        Key: {
            id: req.params.restaurantId
        }
    }, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load restaurant"
            }).end()
        } else {
            if (data['Item']) {
                res.json(data['Item'])
            } else {
                res.status(404).json({
                    message: "The restaurant does not exist"
                })
            }
        }
    })
})

/***************************
 * Restaurant menu methods *
 ***************************/

app.get('/items/restaurants/:restaurantId/menu', function(req, res) {
    // lists all of the menu items for a restaurant.
    if (!req.params.restaurantId) {
        res.status(400).json({
            message: "Invalid restaurant ID"
        }).end()
    }
    dynamoDb.query({
        TableName: MENU_TABLE_NAME,
        KeyConditions: {
            restaurant_id: {
                ComparisonOperator: 'EQ',
                AttributeValueList: [ req.params.restaurantId]
            }
        }
    }, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load restaurant menu"
            }).end()
        } else {
            res.json(data['Items'])
        }
    })
})

app.get('/items/restaurants/:restaurantId/menu/:itemId', function(req, res) {
    // extracts the details of a specific menu item
    if (!req.params.restaurantId || !req.params.itemId) {
        res.status(400).json({
            message: "Invalid restaurant or item identifier"
        }).end()
    }
    dynamoDb.get({
        TableName: MENU_TABLE_NAME,
        Key: {
            restaurant_id: req.params.restaurantId,
            id: req.params.itemId
        }
    }, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load menu item"
            }).end()
        } else {
            if (data['Item']) {
                res.json(data['Item'])
            } else {
                // return 404 if we couldn't find the menu item in the database
                res.status(404).json({
                    message: "The menu item does not exist"
                })
            }
        }
    })
})

/****************************
 * Order management methods *
 ****************************/

app.post('/items/orders', function(req, res) {
    var order = {}
    if (!req.body.restaurant_id) {
        res.status(400).json({
            message: "Invalid restaurant id in order"
        }).end()
        return
    }
    if (!req.body.menu_items || req.body.menu_items.length == 0) {
        res.status(400).json({
            message: "You must order at least one item"
        }).end()
        return
    }

    order.restaurant_id = req.body.restaurant_id
    order.menu_items = req.body.menu_items
    order.id = uuid.v1()

    dynamoDb.put({
        TableName: ORDERS_TABLE_NAME,
        Item: order
    }, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load menu item"
            }).end()
        } else {
            res.json(order)
        }
    })
})

app.get('/items/orders/:orderId', function(req, res) {
    if (!req.params.orderId) {
        res.status(400).json({
            message: "Invalid order id"
        })
    }

    dynamoDb.get({
        TableName: ORDERS_TABLE_NAME,
        Key: {
            id: req.params.orderId
        }
    }, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load order"
            }).end()
        } else {
            if (data['Item']) {
                res.json(data['Item'])
            } else {
                res.status(404).json({
                    message: "The order does not exist"
                })
            }
        }
    })
})

app.delete('/items/orders/:orderId', function(req, res) {
    if (!req.params.orderId) {
        res.status(400).json({
            message: "Invalid order id"
        })
    }

    dynamoDb.delete({
        TableName: ORDERS_TABLE_NAME,
        Key: {
            id: req.params.orderId
        }
    }, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not delete order"
            }).end()
        } else {
            // if the item was deleted then we return a 204 - success but there's no content
            res.status(204).end()
        }
    })
})

/**
 * This is the init API to pre-populate the database with restaurants and a menu
 */
app.post('/items/init', function(req, res) {
    init.init(dynamoDb)
    res.json({
        message: "Init completed!"
    })
})

app.listen(3000, function() {
    console.log("App started")
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
