/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Row, Icon } from 'react-materialize';
import AppRoute from '../index';
import { Segment, Button, Divider, Input, Form, Label, Modal, Image } from 'semantic-ui-react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import '../css/general.css';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import awsmobile from '../aws-exports';
import {Auth} from 'aws-amplify';
export default class Login extends Component {
    state = {
        username: '',
        password: '',
        code: '',
        verificationCode: '',
        logInStatus: false,
        forgetPasswor: false,
        invalidUserNameMessage: '',
        invalidPasswordMessage: '',
        modalOpen: false,
        invalidCodeMessage: '',
        enterMFA: false,
        enableResend: false,
        cognitoUser: ''
    };

    countDownResendVerificationCode = () => {

        let counter = 10;
        var seconds = setInterval(() => {
            if (counter == 0) {
                clearInterval(seconds);
                this.setState(() => {
                    return {
                        enableResend: true
                    }
                });
            }
            counter--;
        }, 1000);
    }

    signInCustomer = async (e) => {
        e.preventDefault();
        this.setState(() => {
            this.username = this.state.username,
            this.password = this.state.password
        });
       Auth.signIn(this.state.username, this.state.password)
            .then(data => {
                if (!this.state.enableResend) {
                    this.setState(() => {
                        enableResend: false
                    });
                    this.countDownResendVerificationCode();
                }
                this.setState(() => ({enterMFA: true, cognitoUser: data}))
            })
            .catch(err => console.log(err)); 
    }

    sendVerificationCode = async(e) => {
        e.preventDefault();
        Auth.confirmSignIn(this.state.cognitoUser, this.state.code)
            .then(
                sessionStorage.setItem('isLoggedIn',true),
                this.setState(() => {
                    return {
                        logInStatus: true
                    }
                })
            )
            .catch (err => console.log(err));   
    }

    render() {
        const { username, password, logInStatus, enterMFA, invalidCredentialsMessage, enableResend } = this.state;
        return (
            <CSSTransitionGroup
                transitionName="sample-app"
                transitionEnterTimeout={500}
                transitionAppearTimeout={500}
                transitionLeaveTimeout={300}
                transitionAppear={true}
                transitionEnter={true}
                transitionLeave={true}>
            <div>
                { !logInStatus && !enterMFA && (
                    <div>
                        <div className="fill-in">
                            <div>
                                <Row>
                                    <Form.Field>
                                        <Input type="text" icon="user" iconPosition="left" placeholder="Username" style={{marginRight: 4 + 'em'}}
                                            onChange = {(event) => this.setState({username:event.target.value, invalidCredentialsMessage: ''})} />
                                    </Form.Field>
                                </Row>
                                <Row>
                                    <Form.Field>
                                        <Input type="password" icon="hashtag" iconPosition='left'  placeholder="Password" style={{marginRight: 4 + 'em'}}
                                            onChange = {(event) => this.setState({password:event.target.value, invalidCredentialsMessage: ''})}/>
                                    </Form.Field>
                                </Row>
                                <Row>
                                    { invalidCredentialsMessage && (<Label basic color='red' pointing='left'>{ invalidCredentialsMessage }</Label>) }
                                </Row>
                                <Link to="/forget"><a>Forgot Password?</a></Link>
                            </div>
                        </div>
                        <div className="button-holder">
                            <Segment padded>
                                <Button primary fluid onClick={this.signInCustomer}>Login</Button>
                                <Divider className="divider" horizontal>Or</Divider>
                                <Link to="/register"><Button secondary fluid>Sign Up Now</Button></Link>
                            </Segment>
                        </div>
                    </div>
                )}
                { logInStatus && (<AppRoute authStatus={true} />)}
                { enterMFA && !logInStatus &&(
                    <div>
                        <div className="fill-in">
                            <Form.Field>
                                <Input type="text" icon="hashtag" iconPosition="left" placeholder="Verification code" style={{marginRight: 4 + 'em'}}
                                    onChange = {(event) => this.setState({code:event.target.value, invalidCredentialsMessage: ''})}/>
                                { invalidCredentialsMessage && <Label basic color='red' pointing='left'>{ invalidCredentialsMessage }</Label> }
                            </Form.Field>
                        </div>
                        <div className='button-holder'>
                            <Button primary fluid onClick={ this.sendVerificationCode }>Validate</Button>
                            { enableResend && (<Button fluid color="purple" onClick={ this.signInCustomer }>Resend it!</Button>)}
                            { !enableResend && (<Button fluid loading disabled>Waiting to resend</Button>) }
                        </div>
                    </div>
                )}
            </div>
            </CSSTransitionGroup>
        );
    }
}
