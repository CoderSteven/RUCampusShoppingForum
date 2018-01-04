import React, { Component } from 'react'
import { AsyncStorage, Alert, ScrollView, View } from 'react-native'
import { List, ListItem, Text, InputGroup, Icon, Input, Title, Button, Spinner, Thumbnail } from 'native-base'
import I18n from '../utils/I18n'
import { db, auth, uploadPic, getUser, timestamp } from '../utils/firebase'

import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'react-native-fetch-blob'

export default class Register extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      avatar: '',
      picPath: '',
      loading: false
    }

  }

  openCamera() {
    ImagePicker.openCamera({
      width: 200,
      height: 200,
      cropping: true
    }).then(image => {
      this.setState({ picPath: image.path })
    }).catch(error => {
      console.log(error)
    })
  }

  pickImage() {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true
    }).then(image => {
      this.setState({ picPath: image.path })
    }).catch(error => {
      console.log(error)
    })
  }

  register() {
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
      const ref = `avatar/${this.state.email}.png`
      uploadPic(this.state.picPath, ref, (url) => {
        //update profile
        auth.currentUser.updateProfile({
          displayName: this.state.name,
          photoURL: url
        })
        //update database
        db.ref('users/' + auth.currentUser.uid).set({
          name: this.state.name,
          email: this.state.email,
          avatar: url,
          createdAt: timestamp,
          updatedAt: timestamp
        })
      })
    }).catch(error => {
      console.log(error)
    })
  }

  renderLoginButton() {
    if (this.state.loading) {
      return (
        <Spinner style={{ alignSelf: 'center' }} color='grey' />
      )
    }
    return (
      <ListItem button onPress={() => { this.register.call(this); this.setState({ loading: true }) } }>
        <Text style={{ alignSelf: 'center' }}>{I18n.t('register')}</Text>
      </ListItem>
    )
  }

  render() {

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F4F4F4' }}>

          <List style={{ marginTop: 7 }}>

            <ListItem>
              <InputGroup>
                <Icon name='ios-text' />
                <Input
                  placeholder={I18n.t('name')}
                  onChangeText={(v) => { this.setState({ name: v }) } }
                  value={this.state.name}
                  autoCapitalize='none'
                  autoCorrect={false}
                  />
              </InputGroup>
            </ListItem>

            <ListItem>
              <InputGroup>
                <Icon name='ios-person' />
                <Input
                  placeholder={I18n.t('email')}
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
                  placeholder={I18n.t('password')}
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={(v) => { this.setState({ password: v }) } }
                  autoCapitalize='none'
                  autoCorrect={false}
                  />
              </InputGroup>
            </ListItem>

            <ListItem iconLeft>
              <Icon name='ios-person' />
              <Text>{I18n.t('avatar')}</Text>
              <Thumbnail square size={60} source={this.state.picPath ? { uri: this.state.picPath } : null} />
              <Button onPress={() => {
                Alert.alert(
                  'Choose A Way',
                  'How do you want to get a photo?',
                  [
                    { text: 'Camera', onPress: () => this.openCamera.call(this) },
                    { text: 'Libaray', onPress: () => this.pickImage.call(this) },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                )
              } } bordered>{I18n.t('photo')}</Button>
            </ListItem>
          </List>
          {this.renderLoginButton()}
      </ScrollView>
    )
  }

}