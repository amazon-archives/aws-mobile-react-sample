# AWS Mobile React Starter Kit

Bootstrap a React application on AWS. This sample automatically provisions a Serverless infrastructure with authentication, authorization, website hosting, API access and database operations. It also includes user registration and MFA support. The sample use case is a "Restaurant" ordering system where after a user registers and logs in they can view different restaurant menus, select items and place orders.

This starter uses the [AWS Amplify JavaScript library](https://github.com/aws/aws-amplify) to add cloud support to the application.

### Quicklinks
 - [Getting started](#getstarted)
 - [Building and deploying](#builddeploy)
 - [Using Registration and Login components in your App](#reglogin)
 - [Using the REST client in your App](#restclient)
 - [Modifying Express routes in Lambda for your App](#lambdamodify)

### Architecture Overview

You will be building a React application with User Registration & Sign-in that allows you to perform CRUD operations against a DynamoDB table by using an [Express](https://expressjs.com) application running in AWS Lambda. Lambda will be invoked by API Gateway using Proxy Integration with greedy paths that only authenticated users can access. The Express server is running with the [AWS Serverless Express framework](https://github.com/awslabs/aws-serverless-express).

![Alt Text](/media/ReactServerless.PNG)

AWS Services used:
* Amazon Cognito User Pools
* Amazon Cognito Federated Identities
* Amazon API Gateway
* AWS Lambda
* Amazon DynamoDB
* Amazon S3
* Amazon CloudFront

### Prerequisites

+ [AWS Account](https://aws.amazon.com/mobile/details/)

+ [NodeJS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/getting-started/installing-node)

+ [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)


## Getting started <a name="getstarted"></a>

First clone this repo:
`git clone https://github.com/awslabs/aws-mobile-react-sample`

## Backend Setup

  1. Set up your AWS resources using AWS Mobile Hub by clicking the button below:

  <p align="center">
  <a target="_blank" href="https://console.aws.amazon.com/mobilehub/home?#/starterkit/?config=https://github.com/awslabs/aws-mobile-react-sample/blob/master/backend/import_mobilehub/react-sample.zip&app=web">
  <span>
      <img height="100%" src="https://s3.amazonaws.com/deploytomh/button-deploy-aws-mh.png"/>
  </span>
  </a>
  </p>

  2. Press **Import project**.


## Client Setup

1. Before proceeding further, in the Mobile Hub console click the **Cloud Logic** tile and ensure that the API deployment status at the bottom shows **CREATE_COMPLETE** (_this can take a few moments_).

2. Install the AWS Mobile CLI and initialize the project (from the root project folder's **client** directory):
  
  ```
    $ npm install -g awsmobile-cli
    $ cd client/
    $ awsmobile init your-unique-mobile-hub-project-id
  ```

 NOTE: Your unique mobile hub project ID can be retrieved from the url from the Mobile Hub console:
 https://console.aws.amazon.com/mobilehub/home?region=us-east-1#/**YOUR-UNIQUE-PROJECT-ID-IS-HERE**/build

Choose `src` as your source directory, and `build` as your build (the defaults). This will download and initialize your local project with your AWS Mobile backend as well as download the aws-exports.js file to your client/src directory.

  * _Alternatively using the Mobile Hub Console_:

You can also download the aws-exports.js file and place it in `client/src/aws-exports.js` by clicking **Configure** on the left hand bar of the Mobile Hub console and selecting the **Hosting and Streaming tile**. Then, at the bottom of the page click **Download aws-exports.js file**. Copy this file into the `./aws-mobile-react-sample/client/src/` folder of the repo you cloned.

   * _Alternatively using the AWS CLI_:

     ```
     $ cd ../aws-mobile-react-sample/client/src/
     $ aws s3api list-buckets --query 'Buckets[?starts_with(Name,`reactsample-hosting`)].Name' |grep reactsample |tr -d '"'
     $ aws s3api get-object --bucket <YOUR_BUCKET_NAME> --key aws-exports.js ./aws-exports.js
     ```

## Run the app

Navigate into  `./aws-mobile-react-sample/client`  and run:
  
  ```
    $ awsmobile run
  ```

To publish your application to Amazon S3 and Amazon CloudFront:

  ```
    $ awsmobile publish
  ```

  * _Alternatively using NPM_:

  ```
    $ npm install
    $ npm start
  ```

 Done!

## Application walkthrough

![Alt Text](/media/Mainpage.PNG)

  1. Open a browser to `http://localhost:8080` and view the sample. Choose **Sign Up Now** and type in a username, password, email address and phone number.

  2. You should recieve a 6-digit verification code via SMS. Type this into the screen and select **Validate**.

  3. Now that you are registered you will be redirected to the Login page. Type in the username and password then select **Login**.

  4. You will recieve another SMS verification code. This is the MFA flow upon user login. Enter the code into the screen and select **Validate**.

  5. The application demonstrates both loading sample data into the database as well as listing data and navigation. As a first time user press **Insert Restaurants** to load sample restaurants into the application.

  * _The sample data is stored inside the imported Lambda function (init.js). This demonstrates how Lambda code can be used with Express to insert records into DynamoDB. The request from the client to API Gateway is signed using [AWS Signature Version 4](http://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) with the credentials returned from Amazon Cognito when the user logged into the application. Refer to the advanced section of this document for more information on using this in your designs._

  6. Now that data has been loaded select **List Restaurants** to display the list of restaurants that were added in the previous step. This also uses the signing process described above.

  7. Click on the name of a restaurant to see a menu.

  8. Press **Order** to place an order in the system. This will add an order entry to a DynamoDB table as well as store information in the local browser for tracking.

  9. Press **Orders** in the navigation bar. You will see some information immediately from local storage and other information returned asynchronously from a call to API Gateway.

  * _The navigation bar is optimized to work across desktop and mobile browsers. It will show either at the top of the page or in a collapsible bar on the left for mobile form factors_  

  10. Select **Logout** in the navigation bar to return the user to the home page.


## Building and deploying <a name="builddeploy"></a>

The following steps outline how you can build and deploy the application using the S3 and CloudFront resources created by the Import phase above:

  1. Navigate to `./aws-mobile-react-sample/client` and build for production by running:

      `$ awsmobile publish`

  This will automatically run the `npm run-script build` command, upload your application to Amazon S3 and Amazon CloudFront, and open your default web browser to the Amazon S3 static web hosting page.

### Automating Build & Deploy

If you are using a CI/CD process you may choose to automate this process. The following shows how to use [a webpack plugin](https://github.com/MikaAK/s3-plugin-webpack) with AWS Credentials to automate deployment to S3:

1. Navigate to `./aws-mobile-react-sample/client/` directory and edit webpack.config.js file. Add the following to the top of the file:

  ```
  const S3Plugin = require('webpack-s3-plugin');
  ```

2. Add the following as an entry to the `plugins:[]` section towards the bottom:

```
new S3Plugin({
      // Only upload css and js
      include: /.*\.(css|js)/,
      // s3Options are required
      s3Options: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      s3UploadOptions: {
        Bucket: 'MyBucket'
      }
    })
```

**NOTE:** Replace the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `MyBucket` with appropriate values such as your account keys for automation and the S3 bucket created during the import process.

3. Save the file and run the following command to install the plugin dependency:

```
npm install --save webpack-s3-plugin
```

4. Run the following command to build and deploy to S3:

```
$ awsmobile publish
```


# Advanced Usage

## Using the Registration and Login components in your application <a name="reglogin"></a>

The Registration and Login components leverage AWS Amplify to make calls to Amazon Cognito User Pools and Amazon Cognito Federated Identities . As an example of using it in your own application first create a React application with [Create React App](https://github.com/facebookincubator/create-react-app):

```
npm install -g create-react-app
create-react-app my-app
cd my-app/
npm start
```

If the application runs successfully, copy the `Auth`, `configuration` and `css` folders from `./aws-mobile-react-sample/client/src` to `./my-app/src` that was created by Create React App. Next copy `index.js` and `Main.jsx` from `./aws-mobile-react-sample/client/src` to `./my-app/src`. Edit the copied `Main.jsx` so that the `return()` function matches the below code:


```
return (
      <div>
        {
          !logOut && (
          <BrowserRouter>
          <div>
            <Navbar className='nav-bar' brand='WebApp' right>
              <NavItem onClick={this.signOut}>Logout</NavItem>
            </Navbar>
            <App/>
          </div>
        </BrowserRouter>)
        }
        {
          logOut && (<AppRoute authStatus={false}/>)
        }
      </div>
    );

```

Next, from your `./my-app` directory, run:

```
$npm install --save aws-amplify react-router-dom react-materialize react-transition-group@^1.1.3 semantic-ui-react css-loader
```

Edit `Main.jsx and comment out the following:`

```
//import Home from './Home';
//import Menu from './API/Menu';
//import Orders from './API/Order';
```

Also add `import App from './App';` to the top of `Main.jsx` and save the file.

Edit `index.js` and replace the `require('file-loader....')` statement towards the top with:

```
require('file-loader?name=[name].[ext]./index.html');
```

Finally to add the styling to the page edit `./my-app/public/index.html` and add the following to the head:

```
<link rel="stylesheet" href="http://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css">
```

And add the following to the body:

```
<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js"></script>
```

You can now run your application created with Create React App with a new login page added:

```
npm start
```

The application should start and allow you to register users and login taking you to the normal page created with Create React App.


### Using AWS Amplify to communicate with API Gateway <a name="restclient"></a>

The sample application uses API Gateway and Lambda to run an Express application which reads and writes to a DynamoDB table. Included in the sample is a helper function for making signed requests to API Gateway. We'll show how to use this helper for making unauthenticated requests to API Gateway below and you can use the Login example above to get authenticated credentials which this sample would use.

As with the previous section first create a React application with [Create React App](https://github.com/facebookincubator/create-react-app):

```
npm install -g create-react-app
create-react-app my-app
cd my-app/
npm start
```

If you didn't do the previous section, copy `configuration` from `./aws-mobile-react-sample/client/src` to `./my-app/src`.

Edit `./my-app/src/App.js` with the following imports at the top:

```
import Link from 'link-react';
import { Table } from 'semantic-ui-react';
import awsmobile from './configuration/aws-exports';
import Amplify,{API} from 'aws-amplify';

Amplify.configure(awsmobile);
```
** NOTE: To make calls to API Gateway through AWS Amplify, you need your IdentityPoolID in aws-exports.js. For further documentation, refer to [AWS Amplify](https://github.com/aws/aws-amplify/blob/master/media/api_guide.md) 
Modify the `App` component like so **(NOTE: you are NOT modifying the render function YET)**:

```
class App extends Component {
  state = {
    data: []
  }
  fetch = async () => {
    this.setState(() => {
        return {
            loading: true
        }
    });

    API.get('ReactSample','/items/restaurants')
        .then(resp => {
            this.setState({
                data: resp
            });
            console.log("response is : ", resp);
        }
        )
        .catch (err => console.log(err))
  }
}

//render logic below
render()....more code
```

Now, change the `render()` function like so:

```
render() {
    return (
      <div className="App">
        <Link onClick={this.fetch}>
          List restaurants
        </Link>
        <div>
          <div>
        {(
      <Table>
          <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Contact</Table.HeaderCell>
            <Table.HeaderCell>Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.data.map((data, idx) =>
            <Table.Row key={idx}>
              <Table.Cell>{data.name}</Table.Cell>
              <Table.Cell>{data.address}</Table.Cell>
              <Table.Cell>{data.phone}</Table.Cell>
              <Table.Cell>{data.rating}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )}
    </div>
        </div>
      </div>
    );
  }
}

export default App;
```

Save the file. Finally install the dependencies:

```
npm install --save link-react semantic-ui-react
```

Depending on if you want to do Authenticated or UnAuthenticated requests to API Gateway, you will need the following modification:

**Authenticated Requests**

  Note: If you are doing an authenticated, signed request you'll also need to perform a couple more steps. First install `querystring-browser`

```
npm install --save querystring-browser@^1.0.4
```

Next you will need to configure this as a webpack alias:

```
resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      querystring: 'querystring-browser'
    }
  }
```

For our Create React App sample you will need to modify either `webpack.config.dev.js` or `webpack.config.prod.js` in the `./my-app/node_modules/react-scripts/config` directory. Look for the `resolve:` field inside `module.exports` and add the `querystring: 'querystring-browser'` entry under the `alias` field.

**UnAuthenticated Requests**

Navigate to the API Gateway console, click on the ReactSample-MobileHub API and select **Resources** on the left hand side of the page. Under the **/items** node select **ANY** and then click on **Method Request** in the right hand side of the console. Click the dropdown labeled **Authorization** and select **NONE**. Press the **Update** tick box to save your changes.

In the same part of the console, select the **/items/{proxy +}** node followed and click **ANY** and then **Method Request**. Repeat the process of setting **Authorization** to **NONE** and saving your change.

Next deploy your changes by select **Actions** at the top of the page, then **Deploy API** and select **Development** as the _Deployment stage_. Click **Deploy**.

Additionally you will need to make an alteration to the `./my-app/src/App.js` by changing the `this.setState()` function from:

```
this.setState({
  data: resp
});
```

To:

```
this.setState({
  data: resp.data
});
```

#### Run your application

Finally, after making your modifications for either the Authenticated or UnAuthenticated request run the following command to launch your Create React App again:

```
npm start
```

Click **List restaurants** at the top of the page to use the AWS Amplify API component.


## Modifying Express routes in Lambda <a name="lambdamodify"></a>

The sample application invokes a Lambda function running Express which will make CRUD operations to DynamoDB depending on the route which is passed from the client application. You may wish to modify this backend behavior for your own needs. The steps outline how you could add functionality to _"create a Restaurant"_ by showing what modifications would be needed in the Lambda function and the corresponding client modifications to make the request.

1. Add the following function into app.js before the section that says  `* Restaurant methods *`

```
var putCallback = function(err, data) {
    if (err) {
        console.log(err)
    }
}

function createMenu(restaurant_id) {
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
```

2. Now in the routes section (under the ` * Restaurant methods *` comment) add in a new POST route:

```
app.post('/items/restaurants/new', function(req, res){
    var restaurant = {}
    restaurant.id = uuid.v1()
    restaurant.name = req.body.name
    restaurant.description = req.body.description
    restaurant.address = req.body.address
    restaurant.phone = req.body.phone
    restaurant.rating =req.body.rating
    dynamoDb.put({
        Item: restaurant,
        TableName: RESTAURANTS_TABLE_NAME
    }, function(err,data){
        if (err){
            res.json({ message: err })
        }else {
            res.json({
                message: "New Restaurant added!"
            })   
        }
    })
    createMenu(restaurant.id)
})
```

3. Save the file and in the Mobile Hub console for your project click the **Cloud Logic** card. Expand the **View resource details** section and note the name of the **Lambda function** in the list for the next step.

4. In a terminal navigate to `./aws-mobile-react-sample/backend/lambda` and run:

```
zip -r lambda-archive.zip .
aws lambda update-function-code --function-name FUNCTION_NAME --zip-file fileb://lambda-archive.zip
```

**REPLACE the FUNCTION_NAME with your Lambda function name from the previous step.**

Alternatively you could click the Lambda function resource in the Mobile Hub console which opens the Lambda console and press the **Upload** button on that page to upload the **lambda-archive.zip** file.

5. In the `./aws-mobile-react-sample/client/src` directory edit `Home.jsx` with the following code **BEFORE** the **render()** method:

```
  newRestaurant = () => {
    let body = JSON.stringify({
      'name': 'New Name',
      'description': 'New description',
      'address': 'New address',
      'phone': 'New phone',
      'rating': 'New rating'
    });

    let requestParams = {
      method: 'POST',
      url: apiRestarauntUri + '/new',
      headers: {'content-type': 'application/json'},
      body
    }

    this.restResponse = restRequest(requestParams)
      .then(data => {
        sessionStorage.setItem('latestOrder', data.id);
        console.log(data);
        alert('Added successfully');
      })
      .catch (function(error){
        console.log(error);
      });
  }
```

Note that `url: apiRestarauntUri + '/new'` matches the path you made for the Express route in the Lambda function you uploaded.

6. In the `return` statement of the `render` method add in a new button next to the others:

```
<Button primary onClick={this.newRestaurant}>
  New Restaurant
</Button>
```

Save your changes and run your application again with `npm start`. You should have a new button after logging in. Press **New Restaurant** and then **List Restaurants** to see the new entry in the system.


### Security Information

#### Storage locations

The website hosting location for this sample uses an S3 bucket as the CloudFront origin. The S3 bucket is by default configured as publicly accessable for testing purposes. To learn more about restricting this access further, see [Amazon S3 Security Considerations](http://docs.aws.amazon.com/mobile-hub/latest/developerguide/s3-security.html) and [Amazon CloudFront Security Considerations](http://docs.aws.amazon.com/mobile-hub/latest/developerguide/cloudfront-security.html).

#### sessionStorage

This sample app uses [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) to persist user tokens (`accessKeyId`, `secretAccessKey` and `sessionToken`). They are deleted when the browser is closed and not available when new tabs are opened. You can take further actions to secure these tokens by encrypting them.

#### API Handler Table Permissions

The Lambda function in this sample will read and write to DynamoDB and it's role will be granted the appropriate permissions to perform such actions. If you wish to modify the sample to perform a more restricted set of actions see [Authentication and Access Control for Amazon DynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/authentication-and-access-control.html).
