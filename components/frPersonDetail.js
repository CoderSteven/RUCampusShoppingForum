import React, { Component } from 'react'
import { Alert, AsyncStorage, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { Thumbnail, InputGroup, Input, Button, Icon, List, ListItem } from 'native-base'
import I18n from '../utils/I18n'
import { db, auth, getUser } from '../utils/firebase'

export default class frPersonDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      person: '',
      user: '',
      liking: false
    }

  }

  componentDidMount() {
    db.ref('users/' + this.props.detailId).once('value', (snapshot) => {
      this.setState({ person: snapshot.val() }, getUser((user) => {
        this.setState({ user }, () => {
          if (this.state.user.fr_likes && this.props.detailId in this.state.user.fr_likes) {
            this.setState({ liking: true })
          } else {
            this.setState({ liking: false })
          }
        })
      }))
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
    if (this.state.person && this.state.user) {
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
                    images: [this.state.person.avatar]
                  },
                  navigatorStyle: { navBarHidden: true },
                })
              } } >
                <Thumbnail size={100} source={{ uri: this.state.person.avatar }} />
              </TouchableOpacity>
              <Text style={{
                alignSelf: 'center',
                marginLeft: 30,
                lineHeight: 24,
                color: '#4a4a4a',
                fontSize: 24,
              }}>{this.state.person.name}</Text>
              {this.state.liking ?
                <Thumbnail style={{ alignSelf: 'center', marginLeft: 10 }} size={16} source={require('../img/like.png')} /> : null}
            </View>

            {this.renderRow('EMAIL', this.state.person.email)}

          </ScrollView>

        </View>
      )
    } else {
      return null
    }
  }
}