import React, { Component } from 'react'
import { Alert, AsyncStorage, ScrollView, View, TouchableOpacity } from 'react-native'
import { Thumbnail, InputGroup, Input, Button, Icon, List, ListItem, Text } from 'native-base'
import I18n from '../utils/I18n'
import { db, auth, getUser } from '../utils/firebase'

export default class MeMain extends Component {

  constructor(props) {
    super(props)

    this.state = {
      user: ''
    }

  }

  componentDidMount() {
    getUser((user) => {
      this.setState({ user })
    })
  }

  renderRow(title, content, onPress) {
    return (
      <View style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        marginLeft: 0,
        height: 45,
        borderBottomWidth: 1,
        borderColor: '#f4f4f4',
        paddingLeft: 15,
      }} onPress={onPress}>
        <Text style={{
          flex: 1,
          alignSelf: 'center',
          fontSize: 14,
          width: 75,
          marginLeft: 15,
          color: '#cf2031',
          fontWeight: 'bold'
        }}>{title}</Text>
        <Text numberOfLines={1} style={{
          flex: 1,
          alignSelf: 'center',
          fontSize: 14,
          width: 200,
          marginRight: 15,
          textAlign: 'right',
          color: '#4a4a4a',
        }}>{content}</Text>
      </View>
    )
  }

  render() {

    return (

      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'white',
            marginLeft: 0,
            borderColor: '#f4f4f4',
            borderBottomWidth: 15,
            height: 150,
            paddingLeft: 30,
          }}>
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => {
              this.props.navigator.showModal({
                screen: 'rprn.gallery',
                passProps: {
                  onSingleTapConfirmed: () => { this.props.navigator.dismissModal() },
                  style: { flex: 1, backgroundColor: 'black' },
                  images: [this.state.user.avatar]
                },
                navigatorStyle: { navBarHidden: true },
              })
            } } >
              <Thumbnail size={100} source={{ uri: this.state.user.avatar }} />
            </TouchableOpacity>
            <Text style={{
              alignSelf: 'center',
              marginLeft: 30,
              lineHeight: 24,
              color: '#4a4a4a',
              fontSize: 24,
            }}>{this.state.user.name}</Text>
          </View>

          {this.renderRow('EMAIL', this.state.user.email)}

          <ListItem button style={{ height: 45, borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}
            onPress={() => {
              this.props.navigator.push({
                title: I18n.t('watching'),
                screen: 'rprn.fmItemList',
                passProps: {
                  category: 'watching'
                }
              })
            } }>
            <Thumbnail size={25} source={{ uri: 'https://res.cloudinary.com/dpvtvua54/image/upload/v1475737495/categories/eye.png' }} />
            <Text>{I18n.t('watching')}</Text>
          </ListItem>
          <ListItem button style={{ height: 45, borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}
            onPress={() => {
              this.props.navigator.push({
                title: I18n.t('selling'),
                screen: 'rprn.fmItemList',
                passProps: {
                  category: 'selling'
                }
              })
            } }>
            <Thumbnail size={25} source={{ uri: 'https://res.cloudinary.com/dpvtvua54/image/upload/v1475737558/categories/selling.png' }} />
            <Text>{I18n.t('selling')}</Text>
          </ListItem>
          <ListItem button style={{ height: 45, borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}
            onPress={() => {
              this.props.navigator.push({
                title: I18n.t('bought'),
                screen: 'rprn.fmItemList',
                passProps: {
                  category: 'bought'
                }
              })
            } }>
            <Thumbnail size={25} source={{ uri: 'https://res.cloudinary.com/dpvtvua54/image/upload/v1475737613/categories/bought.png' }} />
            <Text>{I18n.t('bought')}</Text>
          </ListItem>



          <ListItem
            style={{ backgroundColor: 'white', borderColor: '#f4f4f4', marginLeft: 0, paddingLeft: 15 }}
            button
            onPress={() => {
              AsyncStorage.setItem('msgStr', JSON.stringify({ msgArr: [] }))
            } }>
            <Text style={{ alignSelf: 'center' }} >{I18n.t('clearMsg')}</Text>
          </ListItem>
          <ListItem
            style={{ backgroundColor: 'white', borderColor: '#f4f4f4', marginLeft: 0, paddingLeft: 15 }}
            button
            onPress={() => {
              auth.signOut()
            } }>
            <Text style={{ alignSelf: 'center' }} >{I18n.t('logout')}</Text>
          </ListItem>

        </ScrollView>
      </View>
    )
  }
}