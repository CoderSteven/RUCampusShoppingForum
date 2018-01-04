import React, { Component } from 'react'
import { Icon, ListItem, Text as ListText } from 'native-base'
import { ScrollView, Platform, ListView, RefreshControl, View, Image, TouchableOpacity, Text } from 'react-native'
import I18n from '../utils/I18n'
import { db } from '../utils/firebase'

import FmItemRow from './fmItemRow'

export default class FmMain extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: '',
      refreshing: false
    }

    this.props.navigator.setOnNavigatorEvent((event) => {
      if (event.id === 'create') {
        this.props.navigator.push({
          title: I18n.t('create'),
          screen: 'rprn.fmItemCreate',
          navigatorButtons: {
            rightButtons: [
              {
                title: I18n.t('publish'),
                id: 'publish'
              }
            ]
          },
          navigatorStyle: { tabBarHidden: true }
        })
      }
    })

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    db.ref('fm_items').limitToLast(10).once('value', (snapshot) => {
      let pdata = snapshot.val()
      let data = []
      Object.keys(pdata).map((val) => {
        pdata[val]['id'] = val
        data.unshift(pdata[val])
      })
      this.setState({ data, refreshing: false })
    })
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#F4F4F4' }}>

        {this.state.data ?
          <ListView
            style={{ backgroundColor: '#F4F4F4' }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => { this.setState({ refreshing: true }); this.fetchData() } }
                />
            }
            renderHeader={() =>
              <View>
                <View style={{ height: 125, flexDirection: 'row' }}>
                  <TouchableOpacity style={{ flex: 1, height: 125, justifyContent: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#e7e7e7', backgroundColor: 'white', }}
                    onPress={() => {
                      this.props.navigator.push({
                        title: I18n.t('grocery'),
                        screen: 'rprn.fmItemList',
                        passProps: {
                          category: 'grocery'
                        },
                        navigatorStyle: { tabBarHidden: true }
                      })
                    } }>
                    <Image style={{ alignSelf: 'center', width: 65, height: 65 }} source={require('../img/fm_grocery.png')} />
                    <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 17, fontWeight: '600', color: '#4a4a4a' }}>{I18n.t('grocery')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 125, justifyContent: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#e7e7e7', backgroundColor: 'white' }}
                    onPress={() => {
                      this.props.navigator.push({
                        title: I18n.t('electronics'),
                        screen: 'rprn.fmItemList',
                        passProps: {
                          category: 'electronics'
                        },
                        navigatorStyle: { tabBarHidden: true }
                      })
                    } }>
                    <Image style={{ alignSelf: 'center', width: 65, height: 65 }} source={require('../img/fm_electronics.png')} />
                    <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 17, fontWeight: '600', color: '#4a4a4a' }}>{I18n.t('electronics')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 125, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#e7e7e7', backgroundColor: 'white' }}
                    onPress={() => {
                      this.props.navigator.push({
                        title: I18n.t('textbook'),
                        screen: 'rprn.fmItemList',
                        passProps: {
                          category: 'textbook'
                        },
                        navigatorStyle: { tabBarHidden: true }
                      })
                    } }>
                    <Image style={{ alignSelf: 'center', width: 65, height: 65 }} source={require('../img/fm_textbook.png')} />
                    <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 17, fontWeight: '600', color: '#4a4a4a' }}>{I18n.t('textbook')}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 125, flexDirection: 'row' }}>
                  <TouchableOpacity style={{ flex: 1, height: 125, justifyContent: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#e7e7e7', backgroundColor: 'white', }}
                    onPress={() => {
                      this.props.navigator.push({
                        title: I18n.t('furniture'),
                        screen: 'rprn.fmItemList',
                        passProps: {
                          category: 'furniture'
                        },
                        navigatorStyle: { tabBarHidden: true }
                      })
                    } }>
                    <Image style={{ alignSelf: 'center', width: 65, height: 65 }} source={require('../img/fm_furniture.png')} />
                    <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 17, fontWeight: '600', color: '#4a4a4a' }}>{I18n.t('furniture')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 125, justifyContent: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#e7e7e7', backgroundColor: 'white' }}
                    onPress={() => {
                      this.props.navigator.push({
                        title: I18n.t('motors'),
                        screen: 'rprn.fmItemList',
                        passProps: {
                          category: 'motors'
                        },
                        navigatorStyle: { tabBarHidden: true }
                      })
                    } }>
                    <Image style={{ alignSelf: 'center', width: 65, height: 65 }} source={require('../img/fm_motors.png')} />
                    <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 17, fontWeight: '600', color: '#4a4a4a' }}>{I18n.t('motors')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 125, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#e7e7e7', backgroundColor: 'white' }}
                    onPress={() => {
                      this.props.navigator.push({
                        title: I18n.t('housing'),
                        screen: 'rprn.fmItemList',
                        passProps: {
                          category: 'housing'
                        },
                        navigatorStyle: { tabBarHidden: true }
                      })
                    } }>
                    <Image style={{ alignSelf: 'center', width: 65, height: 65 }} source={require('../img/fm_housing.png')} />
                    <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 17, fontWeight: '600', color: '#4a4a4a' }}>{I18n.t('housing')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            renderSectionHeader={() =>
              <ListItem itemDivider style={{ marginTop: 15, height: 44, borderColor: '#f4f4f4', backgroundColor: '#f4f4f4' }}>
                <Text style={{ fontSize: 13, color: '#8a8a8a', letterSpacing: 2, marginLeft: 5, fontWeight: '800', }}>LATEST ITEMS</Text>
              </ListItem>
            }
            dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.state.data)}
            initialListSize={10}
            enableEmptySections={true}
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
                    },
                    navigatorStyle: { tabBarHidden: true }
                  })
                } }
                />
            }
            >
          </ListView> : null}
      </View >
    )
  }
}