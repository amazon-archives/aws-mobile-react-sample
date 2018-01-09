/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Row } from 'react-materialize';
import { Button, Input, Form, Label, Icon, Modal, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import './../css/general.css';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import awsmobile from './../aws-exports';
import {Auth} from 'aws-amplify';
export default class Register extends Component {

    state = {
        username: '',
        password: '',
        passwordMatch: '',
        email: '',
        phone: '',
        code: '',
        enterAuth: false,
        authSuccess: false,
        invalidUserNameMessage: '',
        invalidPasswordMessage: '',
        invalidEmailMessage: '',
        invalidPhoneMessage: '',
        invalidCodeMessage: '',
        invalidFormDataMessage: '',
        enableResend: false
    };

    handleVerificationCodeChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        this.setState(() => {
            return {
                code: value,
                invalidCodeMessage: ''
            }
        });
    }

      handleSubmit = async (e) => {
          e.preventDefault();

          const username = this.state.username.trim();
          const password = this.state.password.trim();
          const passwordMatch = this.state.passwordMatch.trim();

          const email = this.state.email.trim();
          
          const phone = this.state.phone.trim();
          

          const validUserNameMessage = !this.state.invalidUserNameMessage;
          const validPasswordMessage = !this.state.invalidPasswordMessage;
          const validEmailMessage = !this.state.invalidEmailMessage;
          const validPhoneMessage = !this.state.invalidPhoneMessage;
          const validEmailPattern = this.checkEmailPattern(this.state.email);
          const validPhonePattern = this.checkPhonePattern(this.state.phone);
          const validPasswordMatch = this.checkPasswordMatch(password, passwordMatch);
          const validUsernameMatch = this.checkUsernameMatch(this.state.username);

          const checkRegistrationForm = validUserNameMessage && validPasswordMessage
                        && validEmailMessage  && validPhoneMessage
                        && validEmailPattern && validPhonePattern
                        && validPasswordMatch && validUsernameMatch;

         if (!checkRegistrationForm) {
             alert("Invalid registration details.")
             return;
         }
         Auth.signUp(username,password,email,phone)
             .then(
                this.setState(() => {
                    return {
                        enterAuth: true
                    }
                })
             )
             .catch( err =>
                console.log(err)
             )
    }

    handleSubmitVerification = async (e) => {
        e.preventDefault();
        const verificationCode = this.state.code;
        const username = this.state.username;
        Auth.confirmSignUp(username, verificationCode)
            .then(
                this.setState(() => {
                    return {
                        authSuccess: true
                    }
                })
            )
            .catch(
                this.setState(() => {
                    return {
                        invalidCodeMessage: 'Invalid Verification Code'
                    }
                })
            ) 
    }

    resendVerificationCode = async (e) => {
        e.preventDefault();
        const username = this.state.username;
        Auth.resendSignUp(username)
            .then(
                this.setState(() => {
                    return {
                        enableResend: false,
                    }
                })
            )
            .catch(
                err => console.log(err)
            )    
    }

    checkUsernameMatch = (username) => {
        return username && username.length > 1;
    }

    checkPasswordMatch = (password, passwordMatch) => {
        return password === passwordMatch;
    }

    checkEmailPattern = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    checkPhonePattern = (phone) => {
        return /\+1[0-9]{3}[0-9]{3}[0-9]{4}$/.test(phone);
    }

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

    handlePasswordMatchChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const message = this.checkPasswordMatch(value, this.state.password) ? '' : 'Password does not match';
        this.setState(() => {
            return {
                passwordMatch: value,
                invalidPasswordMessage: message,
                invalidFormDataMessage: ''
            }
        });
    }

    render() {
        const { username,
                password,
                passwordMatch,
                email,
                phone,
                invalidUserNameMessage,
                invalidPasswordMessage,
                invalidEmailMessage,
                invalidPhoneMessage,
                enableResend,
                invalidCodeMessage,
                invalidFormDataMessage } = this.state;

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
                    {!this.state.enterAuth && !this.state.authSuccess && (
                        <div>
                            <div className="fill-in">
                                <form>
                                    <Row>
                                        <Form.Field>
                                            <Input type="text" icon="user plus" iconPosition="left" placeholder="Username" style={{marginRight: 4 + 'em'}}
                                            onChange = {(event) => this.setState({username:event.target.value, invalidUserNameMessage: '', invalidFormDataMessage: ''})}/>
                                            { invalidUserNameMessage && <Label basic color="red" pointing="left" >{ invalidUserNameMessage }</Label> }
                                            { username && !this.checkUsernameMatch(username) && <Label basic color="red" pointing="left">Invalid username, must conatin atleast 1 character</Label> }
                                        </Form.Field>
                                    </Row>
                                    <Row>
                                        <Form.Field>
                                            <Input type="password" icon="hashtag" iconPosition="left" placeholder="Password" style={{marginRight: 4 + 'em'}}
                                            onChange = {(event) => this.setState({password:event.target.value, invalidPasswordMessage: '', invalidFormDataMessage: ''})}/>
                                            { invalidPasswordMessage && <Label basic color="red" pointing="left">{ invalidPasswordMessage }</Label> }
                                        </Form.Field>
                                    </Row>
                                    <Row>
                                        <Form.Field>
                                            <Input type="password" icon="hashtag" iconPosition="left" placeholder="Re-enter Password" style={{marginRight: 4 + 'em'}} onChange={this.handlePasswordMatchChange}/>
                                            { invalidPasswordMessage && <Label basic color="red" pointing="left">{ invalidPasswordMessage }</Label> }
                                        </Form.Field>
                                    </Row>
                                    <Row>
                                        <Form.Field>
                                            <Input type="email" icon="envelope" iconPosition="left" placeholder="Email" style={{marginRight: 4 + 'em'}}
                                            onChange = {(event) => this.setState({email:event.target.value, invalidEmailMessage: '', invalidFormDataMessage: ''})}/>
                                            { invalidEmailMessage && <Label basic color="red" pointing="left">{ invalidEmailMessage }</Label> }
                                            { email && !this.checkEmailPattern(email) && <Label basic color="red" pointing="left">Invalid email format</Label> }
                                        </Form.Field>
                                    </Row>
                                    <Row>
                                        <Form.Field>
                                            <Input type="tel" icon="phone" iconPosition="left" placeholder="Phone" style={{marginRight: 4 + 'em'}}
                                            onChange = {(event) => this.setState({phone:event.target.value, invalidPhoneMessage: '', invalidFormDataMessage: ''})}/>
                                            { invalidPhoneMessage && <Label basic color="red" pointing="left">{ invalidPhoneMessage }</Label> }
                                            { phone && !this.checkPhonePattern(phone) && <Label basic color="red" pointing="left">Valid format: +11234567890</Label> }
                                        </Form.Field>
                                    </Row>
                                </form>
                            </div>
                            <div className="button-holder"><Button primary fluid onClick={this.handleSubmit}>Register</Button>
                                { invalidFormDataMessage && <Label basic color="red" pointing="left">{ invalidFormDataMessage }</Label> }
                            </div>
                        </div>
                    )}
                    {this.state.enterAuth && !this.state.authSuccess && (
                    <div>
                        <div className="fill-in">
                            <Row>
                                <Input type="text" icon="unlock alternate" iconPosition="left" placeholder="Verification Code" style={{marginRight: 4 + 'em'}}
                                onChange = {(event) => this.setState({code:event.target.value, invalidCodeMessage: ''})} />
                                { invalidCodeMessage && <Label basic color="red" pointing="left">Invalid verfication code</Label> }
                            </Row>
                        </div>
                        <div className="button-holder">
                            <Button primary fluid onClick={ this.handleSubmitVerification }>Confirm</Button>
                            { !enableResend && <Button fluid loading onClick={this.countDownResendVerificationCode()}>Waiting to resend</Button> }
                            { enableResend && <Button fluid color="purple" onClick={this.resendVerificationCode}>Resend it!</Button> }
                        </div>
                    </div>
                    )}
                    {this.state.authSuccess && (<Redirect to='/Auth/login' />)}
                </div>
                </CSSTransitionGroup>
            )
    }
}
