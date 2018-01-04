import React, { Component } from 'react'
import { AsyncStorage, Alert, ScrollView, View } from 'react-native'
import { List, ListItem, Text, InputGroup, Icon, Input, Title, Button, Spinner } from 'native-base'
import I18n from '../utils/I18n'
import { auth } from '../utils/firebase'

export default class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      loading: false
    }

    this.props.navigator.setOnNavigatorEvent((event) => {
      if (event.id === 'register') {
        this.props.navigator.push({
          title: I18n.t('register'),
          screen: 'rprn.register'
        })
      }
    })

  }

  loginPress() {
    auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
      this.setState({ loading: false })
      console.log(error)
    })
  }

  renderLoginButton() {
    if (this.state.loading) {
      return (
        <Spinner style={{alignSelf: 'center'}} color='grey'/>
      )
    }
    return (
      <ListItem button onPress={() => { this.loginPress.call(this); this.setState({ loading: true }) } }>
        <Text style={{alignSelf: 'center'}} >{I18n.t('login') }</Text>
      </ListItem>
    )
  }

  render() {

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F4F4F4' }}>

          <List style={{ marginTop: 7 }}>
            <ListItem>
              <InputGroup>
                <Icon name='ios-person' />
                <Input
                  autoFocus={true}
                  keyBoardType='email-address'
                  returnKeyType='next'
                  placeholder={I18n.t('email') }
                  onChangeText={(v) => { this.setState({ email: v }) } }
                  value={this.state.email}
                  autoCapitalize='none'
                  autoCorrect={false}
                  />
              </InputGroup>
            </ListItem>

            <ListItem>
              <InputGroup>
                <Icon name='ios-unlock' />
                <Input
                  placeholder={I18n.t('password') }
                  returnKeyType='send'
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={(v) => { this.setState({ password: v }) } }
                  autoCapitalize='none'
                  autoCorrect={false}
                  />
              </InputGroup>
            </ListItem>

          </List>

          {this.renderLoginButton() }
      </ScrollView>
    )
  }
}