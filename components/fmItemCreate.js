import React, { Component } from 'react'
import { AsyncStorage, Dimensions, TouchableOpacity, View, TextInput, Alert, ScrollView, Text } from 'react-native'
import { Thumbnail, List, ListItem } from 'native-base'
import I18n from '../utils/I18n'
import { db, auth, storage, uploadPics, getUser, timestamp } from '../utils/firebase'
import ImagePicker from 'react-native-image-crop-picker'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Picker from 'react-native-picker'

export default class FmItemCreate extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      seller: {},
      price: '',
      description: '',
      category: 'grocery',
      picPaths: [],
      loading: false,
    }

    this.pickImage = this.pickImage.bind(this)
    this.openCamera = this.openCamera.bind(this)
    this.createItem = this.createItem.bind(this)

    this.props.navigator.setOnNavigatorEvent(event => {
      if (event.id === 'publish') {
        this.createItem()
      }
    })

  }

  openCamera() {
    ImagePicker.openCamera({
      width: 900,
      height: 600,
      cropping: true
    }).then(image => {
      let picPaths = this.state.picPaths
      picPaths.push(image.path)
      this.setState({ picPaths })
    }).catch(error => {
      console.log(error)
    })
  }

  pickImage() {
    ImagePicker.openPicker({
      width: 900,
      height: 600,
      cropping: true
    }).then(image => {
      let picPaths = this.state.picPaths
      picPaths.push(image.path)
      this.setState({ picPaths })
    }).catch(error => {
      console.log(error)
    })
  }

  createItem() {
    const newItemRef = db.ref('fm_items').push()
    const refPrefix = `fm_items/${newItemRef.key}`
    uploadPics(this.state.picPaths, refPrefix, (urls) => {
      const itemData = {
        name: this.state.name,
        seller: {
          uid: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          avatar: auth.currentUser.photoURL
        },
        description: this.state.description,
        category: this.state.category,
        price: this.state.price,
        pics: urls,
        upvotes: {},
        views: 0,
        comments: {},
        createdAt: timestamp,
        updatedAt: timestamp
      }
      newItemRef.set(itemData).then(() => {
        this.props.navigator.pop()
      })
    })
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

        <List>

          <ListItem style={{ borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ alignSelf: 'center', color: '#929292', fontSize: 15, width: 80 }}>{I18n.t('name')}:</Text>
              <TextInput
                style={{ alignSelf: 'center', color: '#4A4A4A', flex: 1, fontSize: 15, height: 44, borderWidth: 0 }}
                onChangeText={(v) => { this.setState({ name: v }) } }
                value={this.state.name}
                autoCapitalize='none'
                autoCorrect={false}
                />
            </View>
          </ListItem>

          <ListItem style={{ borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ alignSelf: 'center', color: '#929292', fontSize: 15, width: 80 }}>{I18n.t('category')}:</Text>
              <TouchableOpacity onPress={() => {
                Picker.init({
                  pickerBg: [232, 232, 232, 1],
                  pickerConfirmBtnText: I18n.t('confirm'),
                  pickerCancelBtnText: I18n.t('cancel'),
                  pickerTitleText: '',
                  pickerData: [I18n.t('grocery'), I18n.t('motors'), I18n.t('electronics'), I18n.t('furniture'), I18n.t('textbook'), I18n.t('housing')],
                  selectedValue: [I18n.t('grocery')],
                  onPickerConfirm: data => {
                    let category = ''
                    if (data[0] === I18n.t('grocery')) category = 'grocery'
                    if (data[0] === I18n.t('motors')) category = 'motors'
                    if (data[0] === I18n.t('electronics')) category = 'electronics'
                    if (data[0] === I18n.t('furniture')) category = 'furniture'
                    if (data[0] === I18n.t('textbook')) category = 'textbook'
                    if (data[0] === I18n.t('housing')) category = 'housing'
                    this.setState({ category })
                  },
                })
                Picker.show()
              } }>
                <Text style={{ alignSelf: 'center', color: '#4A4A4A', lineHeight: 44, height: 44, fontSize: 15 }}>{I18n.t(this.state.category)}</Text>
              </TouchableOpacity>
            </View>
          </ListItem>

          <ListItem style={{ borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ alignSelf: 'center', color: '#929292', fontSize: 15, width: 80 }}>{I18n.t('price')}($):</Text>
              <TextInput
                style={{ alignSelf: 'center', color: '#4A4A4A', flex: 1, fontSize: 15, height: 44, borderWidth: 0 }}
                onChangeText={(v) => { this.setState({ price: v }) } }
                value={this.state.price}
                autoCapitalize='none'
                autoCorrect={false}
                />
            </View>
          </ListItem>

          <ListItem style={{ borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={{ flex: 1, marginTop: 10, color: '#929292', height: 44, fontSize: 15 }}>{I18n.t('pics')}:</Text>
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: -10, flex: 1, height: 74, borderWidth: 0 }}>
                {this.state.picPaths ? this.state.picPaths.map((picPath, idx) => {
                  return (
                    <Thumbnail key={idx} style={{ alignSelf: 'center', borderColor: '#979797', borderWidth: 0.5, marginRight: 10, borderRadius: 8 }} square size={74} source={{ uri: picPath }} />
                  )
                }) : null}
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    'Choose A Way',
                    'How do you want to get a photo?',
                    [
                      { text: 'Camera', onPress: () => this.openCamera() },
                      { text: 'Libaray', onPress: () => this.pickImage() },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  )
                } }>
                  <Thumbnail style={{ alignSelf: 'center', borderRadius: 8 }} square size={74} source={require('../img/addImg.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </ListItem>

          <ListItem style={{ borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={{ flex: 1, marginTop: 10, color: '#929292', height: 44, fontSize: 15 }}>{I18n.t('description')}:</Text>
              <TextInput
                style={{ marginTop: -10, color: '#4A4A4A', fontSize: 15, height: 250, borderWidth: 0 }}
                multiline={true}
                onChangeText={(v) => { this.setState({ description: v }) } }
                value={this.state.description}
                autoCapitalize='none'
                autoCorrect={false}
                />
            </View>
          </ListItem>

        </List>
        <KeyboardSpacer />
      </ScrollView>
    )
  }
}