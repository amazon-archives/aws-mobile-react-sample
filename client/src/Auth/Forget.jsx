/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Input, Form, Label } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import awsmobile from '../aws-exports';
import {Auth} from 'aws-amplify';

export default class Forget extends Component {

    state = {
        username: '',
        code: '',
        invalidUserNameMessage: '',
        invalidCodeMessage: '',
        resetSuccess: false,
        enterReset: false,
        enableResend: false,
        enableSend: true,
        enterInputPassword: false,
        password: '',
        passwordMatch: '',
        invalidPasswordMessage: '',
        submitPassword: false,
        invalidCodeOrPasswordMessage: ''
    }

    handlePasswordMatchChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const message = this.checkPasswordMatch(value, this.state.password) ? '' : 'Password does not match';
        this.setState(() => {
            return {
                passwordMatch: value,
                invalidPasswordMessage: message,
                invalidCodeOrPasswordMessage: ''
            }
        });
    }

    checkPasswordMatch = (password, passwordMatch) => {
        return password === passwordMatch;
    }

    sendVerificationCode = async (e) => {
        e.preventDefault();
        const username = this.state.username;
        if (!username) {
            this.setState(() => {
                return {
                    invalidCodeOrPasswordMessage: 'Please input valid username'
                }
            })
        }
        Auth.forgotPassword(username)
            .then(data => {
                if (this.state.enableSend) {
                    this.setState(() => {
                        return {
                            enableSend: false
                        }
                    });
                    this.countDownResendVerificationCode();
                }
                if (this.state.enableResend) {
                    this.setState(() => {
                        return {
                            enableResend: false
                        }
                    })
                    this.countDownResendVerificationCode();
                }
                this.setState({ enterReset: true});
            })
            .catch(err => console.log(err));
    }

    resendVerificationCode = (e) => {
        e.preventDefault();
        this.state.userObject.resendConfirmationCode((err, result) => {
            if (err) {
                this.checkUsername(err.toString());
                console.log(err.toString());
                return;
            }
            this.countDownResendVerificationCode();
        });
    }

    enterInputPassword = (e) => {
        e.preventDefault();
        const code = this.state.code;
        if (!code) {
            this.setState(() => {
                return {
                    invalidCodeOrPasswordMessage: 'Verification code can not be empty'
                }
            });
            return;
        }
        this.setState(() => {
            return {
                enterInputPassword: true,
                enterReset: false,
                invalidCodeOrPasswordMessage: ''
            }
        });
    }

    handlePasswordReset = async (e) => {
        e.preventDefault();
        const message = this.state.invalidPasswordMessage;
        if (message) {
            return;
        }
        const username = this.state.username;
        const verificationCode = this.state.code;
        const newPassword = this.state.password;
        Auth.forgotPasswordSubmit(username, verificationCode, newPassword)
            .then(
                this.setState(() => {
                    return {
                        resetSuccess: true
                    }
                })
            )
            .catch(err => console.log(err))
    }

    countDownResendVerificationCode = () => {
        let counter = 10;
        let seconds = setInterval(() => {
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

    render() {
        const {
            invalidPasswordMessage,
            invalidCodeOrPasswordMessage,
            resetSuccess,
            enableSend,
            enableResend,
            enterReset,
            enterInputPassword } = this.state;

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
                { !resetSuccess && (
                <div>
                    <div className="fill-in">
                        { !enterReset && !enterInputPassword && (
                        <Form.Field>
                            <Input type="text" icon="users" iconPosition="left" placeholder="Username" style={{marginRight: 4 + 'em'}}
                                onChange = {(event) => this.setState({username:event.target.value, invalidCodeOrPasswordMessage: ''})} />
                            { invalidCodeOrPasswordMessage && <Label basic color="red" pointing="left">{ invalidCodeOrPasswordMessage }</Label> }
                        </Form.Field>
                        )}
                        { enterReset && !enterInputPassword && (
                        <Form.Field>
                            <Input type="text" icon="code" iconPosition="left" placeholder="Verification Code" style={{marginRight: 4 + 'em'}}
                                onChange = {(event) => this.setState({code:event.target.value, invalidCodeOrPasswordMessage: '', invalidCodeMessage: ''})}/>
                            { invalidCodeOrPasswordMessage && <Label basic color="red" pointing="left">{ invalidCodeOrPasswordMessage }</Label> }
                        </Form.Field>
                        )}
                        { enterInputPassword && (
                        <Form.Field>
                            <Input type="password" icon="code" iconPosition="left" placeholder="Password" style={{marginRight: 4 + 'em'}}
                                onChange = {(event) => this.setState({password:event.target.value, invalidPasswordMessage: '', invalidCodeOrPasswordMessage: ''})}/>
                            <Input type="password" icon="code" iconPosition="left" placeholder="Password" style={{marginRight: 4 + 'em'}} onChange={this.handlePasswordMatchChange} />
                            { invalidPasswordMessage && <Label basic color="red" pointing="left">Password does not match</Label>}
                            { invalidCodeOrPasswordMessage && <Label basic color="red" pointing="left">{ invalidCodeOrPasswordMessage }</Label> }
                        </Form.Field>
                        )}
                    </div>
                    <div className="button-holder">
                        { enterReset && <Button primary fluid onClick={this.enterInputPassword}>Reset password</Button> }
                        { enterInputPassword && <Button primary fluid onClick={this.handlePasswordReset}>Submit</Button> }
                        { enableSend && <Button primary fluid onClick={this.sendVerificationCode}>Send Verficiation Code</Button> }
                        { !enableResend && !enableSend && <Button fluid loading disabled>Waiting to resend</Button> }
                        { enableResend && enterReset && <Button fluid color="purple" onClick={ this.sendVerificationCode }>Resend it!</Button> }
                    </div>
                </div>
                )}
                { resetSuccess && <Redirect to="/login" /> }
            </div>
            </CSSTransitionGroup>
        );
    }
}
