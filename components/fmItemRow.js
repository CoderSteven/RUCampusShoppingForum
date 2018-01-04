import React, { Component } from 'react'
import { ListItem, Thumbnail, Text as ListText } from 'native-base'
import { Text } from 'react-native'
import I18n from '../utils/I18n'
import TimeAgo from 'react-native-timeago'

export default class FmItemRow extends Component {
  render() {
    return (
      <ListItem style={{
        marginLeft: 0,
        paddingLeft: 15,
        backgroundColor: 'white',
        borderColor: '#f4f4f4',
        height: 100,
        justifyContent: 'flex-start'
      }} button onPress={this.props.onPress}>
        <Thumbnail size={74} style={{ borderRadius: 8 }} square source={{ uri: this.props.pics[0] }} />
        <Text numberOfLines={2} style={{ flex: 1, marginTop: 5, fontWeight: '600', color: '#4a4a4a' }}>{this.props.title}</Text>
        <Text style={{ position: 'absolute', bottom: 5, fontWeight: '600', fontSize: 16, color: '#cf2031' }}>{"$" + this.props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
        <Text style={{ position: 'absolute', color: '#929292', bottom: 5, right: 5, fontSize: 12 }}><TimeAgo time={this.props.createdAt}></TimeAgo></Text>
      </ListItem>
    )
  }
}