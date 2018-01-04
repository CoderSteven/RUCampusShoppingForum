import React, { Component } from 'react'
import { InputGroup, Input, Button, Icon, Title, ListItem, Text } from 'native-base'
import { Platform, ScrollView, RefreshControl, View, ListView } from 'react-native'

import FmItemRow from './fmItemRow'
import I18n from '../utils/I18n'
import { db } from '../utils/firebase'

export default class FmItemList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: '',
      refreshing: false,
    }

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    db.ref('fm_items').orderByChild('category').startAt(this.props.category).endAt(this.props.category).limitToLast(10).once('value', (snapshot) => {
      let pdata = snapshot.val() ? snapshot.val() : {}
      let data = []
      Object.keys(pdata).map((val) => {
        pdata[val]['id'] = val
        data.unshift(pdata[val])
      })
      this.setState({ data })
    })
    this.setState({ refreshing: false })
  }

  render() {
    if (this.state.data) {
      return (
        <ListView
          style={{backgroundColor: '#F4F4F4'}}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => { this.setState({ refreshing: true }); this.fetchData() } }
              />
          }
          dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.state.data)}
          initialListSize={10}
          renderRow={(rowData, sectionID, rowID) =>
            <FmItemRow
              key={rowID}
              title={rowData.name}
              price={rowData.price}
              seller={rowData.seller}
              createdAt={rowData.createdAt}
              pics={rowData.pics}
              onPress={() => {
                this.props.navigator.push({
                  title: I18n.t('detail'),
                  screen: 'rprn.fmItemDetail',
                  passProps: {
                    detailId: rowData.id
                  }
                })
              } }
              />
          }
          >
        </ListView>
      )
    } else {
      return null
    }
  }
}