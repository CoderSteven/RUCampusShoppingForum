import React, { Component } from 'react'
import { ScrollView, Animated, Text, View, TouchableOpacity, TextInput, Image, ListView, Dimensions, RefreshControl } from 'react-native'
import { Icon, Button, List, InputGroup, Input, ListItem, Thumbnail, Text as ListText } from 'native-base'
import I18n from '../utils/I18n'
import { db, auth, getUser, timestamp } from '../utils/firebase'

import TimeAgo from 'react-native-timeago'
import moment from 'moment'
import Gallery from 'react-native-gallery'
import KeyboardSpacer from 'react-native-keyboard-spacer'

export default class FmItemDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: '',
      refreshing: false,
      upvoting: false,
      showingInput: false,
      showingReplyBtn: false,
      bidding: false,
      replying: false,
      replyingTo: '',
      comment: '',
      replyMargin: new Animated.Value(-100),
    }

  }

  componentDidMount() {

    db.ref('fm_items/' + this.props.detailId).once('value', (snapshot) => {
      this.setState({ data: snapshot.val() }, () => {

        if (this.state.data.upvotes && Object.keys(this.state.data.upvotes).includes(auth.currentUser.uid)) this.setState({ upvoting: true })

        let data = this.state.data
        data['upvotes'] = data['upvotes'] ? data['upvotes'] : {}
        data['views'] = data['views'] ? data['views'] + 1 : 1
        db.ref('fm_items/' + this.props.detailId).update({ views: this.state.data.views }).then(() => {
          this.setState({ data })
        })
      })
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <ScrollView style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
          {this.state.data ?
            <List>
              <ListItem style={{ borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
                <Text style={{ marginTop: 5, marginBottom: 5, fontSize: 20, color: '#4A4A4A' }}>{this.state.data.name}</Text>
              </ListItem>

              <ListItem style={{ borderColor: '#f4f4f4', height: 60, backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }} onPress={() => {
                this.props.navigator.push({
                  title: I18n.t('card'),
                  screen: 'rprn.frPersonDetail',
                  passProps: {
                    handleAdd: () => { },
                    detailId: this.state.data.seller.uid
                  },
                  navigatorStyle: { tabBarHidden: true }
                })
              } }>
                <Thumbnail size={40} source={{ uri: this.state.data.seller.avatar }} />
                <ListText style={{ color: '#4A4A4A' }}>{this.state.data.seller.name}</ListText>
                <ListText note >Posted <TimeAgo time={this.state.data.createdAt}></TimeAgo></ListText>
                <Icon name='ios-arrow-forward' style={{ position: 'absolute', top: 2, right: 5, fontSize: 20, color: '#BDBDBD' }} />
              </ListItem>

              <ListItem style={{ borderColor: '#f4f4f4', height: 44, backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ alignSelf: 'center', color: '#929292', fontSize: 15, width: 80 }}>{I18n.t('price')}($):</Text>
                  <Text style={{ alignSelf: 'center', fontWeight: '600', fontSize: 16, color: '#cf2031' }}>{"$" + this.state.data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
              </ListItem>

              <ListItem style={{ borderColor: '#f4f4f4', backgroundColor: 'white', marginLeft: 0, paddingLeft: 15 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: '#4A4A4A' }}>{this.state.data.description}</Text>
                  {this.state.data ? this.state.data.pics.map((pic, idx) => {
                    return <Image style={{ marginTop: 10, width: Dimensions.get('window').width - 34, height: (Dimensions.get('window').width - 34) * 0.66 }} key={idx} source={{ uri: pic }} />
                  }) : null}
                  <Text style={{ alignSelf: 'flex-end', marginTop: 15, marginRight: 9, marginBottom: 5, color: '#9B9B9B', fontSize: 13 }}>{moment(this.state.data.createdAt).format('MMM D YYYY    HH:MM A')}</Text>
                </View>
              </ListItem>

              <View style={{ flex: 1, margin: 0, flexDirection: 'row', borderColor: '#f4f4f4', height: 45, borderBottomWidth: 0, backgroundColor: 'white' }}>
                {this.state.upvoting ?
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 45, borderRightWidth: 1, borderColor: '#f4f4f4' }} onPress={() => {
                    db.ref('fm_items/' + this.props.detailId + '/upvotes/' + auth.currentUser.uid).remove().then(() => { let data = this.state.data; delete data.upvotes[auth.currentUser.uid]; this.setState({ upvoting: false, data }) })
                  } }>
                    <Image style={{ height: 15.76, width: 16.7, alignSelf: 'center', marginRight: 5 }} source={require('../img/red_upvote.png')}></Image>
                    <Text style={{ color: '#923E46', fontSize: 17, alignSelf: 'center' }}> {this.state.data.upvotes ? Object.keys(this.state.data.upvotes).length : 0}</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 45, borderRightWidth: 1, borderColor: '#f4f4f4' }} onPress={() => {
                    db.ref('fm_items/' + this.props.detailId + '/upvotes/' + auth.currentUser.uid).set(1).then(() => { let data = this.state.data; data['upvotes'][auth.currentUser.uid] = 1; this.setState({ upvoting: true }) })
                  } }>
                    <Image style={{ height: 15.76, width: 16.7, alignSelf: 'center', marginRight: 5 }} source={require('../img/upvote_icon.png')}></Image>
                    <Text style={{ color: '#4A4A4A', fontSize: 17, alignSelf: 'center' }}> {this.state.data.upvotes ? Object.keys(this.state.data.upvotes).length : 0}</Text>
                  </TouchableOpacity>
                }
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 45, borderRightWidth: 1, borderColor: '#f4f4f4' }}>
                  <Image style={{ alignSelf: 'center', marginRight: 5 }} source={require('../img/comment_icon.png')}></Image>
                  <Text style={{ color: '#4A4A4A', fontSize: 17, alignSelf: 'center' }}> {this.state.data.comments ? Object.keys(this.state.data.comments).length : 0}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 45, borderRightWidth: 0, borderColor: '#f4f4f4' }}>
                  <Image style={{ alignSelf: 'center', marginRight: 5 }} source={require('../img/view_icon.png')}></Image>
                  <Text style={{ color: '#4A4A4A', fontSize: 17, alignSelf: 'center' }}> {this.state.data.views}</Text>
                </View>
              </View>

            </List> : null}


          {this.state.data.comments ?
            <ListView
              style={{ backgroundColor: '#F4F4F4' }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => { this.setState({ refreshing: true }); this.fetchData() } }
                  />
              }
              renderSectionHeader={() =>
                <ListItem itemDivider style={{ marginTop: 15, height: 44, borderColor: '#f4f4f4', backgroundColor: '#f4f4f4' }}>
                  <Text style={{ fontSize: 13, color: '#8a8a8a', letterSpacing: 2, marginLeft: 5, fontWeight: '800', }}>COMMENTS</Text>
                </ListItem>
              }
              dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.state.data.comments)
              }
              initialListSize={10}
              enableEmptySections={true}
              renderRow={(rowData, sectionID, rowID) =>
                <View style={{ padding: 15, backgroundColor: 'white', borderColor: '#f4f4f4', borderTopWidth: 1 }}>

                  {/** Commenter avatar and name */}
                  <View style={{ flex: 1, flexDirection: 'row' }} >
                    <Thumbnail size={42} source={{ uri: rowData.author.avatar }}></Thumbnail>

                    <TouchableOpacity onPress={() => this.props.navigator.push({
                      title: I18n.t('card'),
                      screen: 'rprn.frPersonDetail',
                      passProps: {
                        handleAdd: () => { },
                        detailId: rowData.author.uid
                      },
                      navigatorStyle: { tabBarHidden: true }
                    })}>
                      <Text style={{ color: '#923E46', fontWeight: '600', marginLeft: 15, fontSize: 15, alignSelf: 'flex-start' }}>{rowData.author.name}</Text>
                    </TouchableOpacity>

                    {/*** Reply animation button */}
                    {this.state.showingReplyBtn === rowID ?
                      <Animated.View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', marginTop: -5, backgroundColor: '#F0DBDD', width: 130, padding: 4, borderRadius: 4, height: 24, right: this.state.replyMargin }} >
                        <TouchableOpacity onPress={() => {
                          let upvoterData = {
                            name: auth.currentUser.displayName,
                            avatar: auth.currentUser.photoURL
                          }
                          db.ref('fm_items/' + this.props.detailId + '/comments/' + rowID + '/upvoters/' + auth.currentUser.uid).set(upvoterData).then(() => {
                            let data = this.state.data
                            data['comments'][rowID]['upvoters'] = data['comments'][rowID]['upvoters'] ? data['comments'][rowID]['upvoters'] : {}
                            data['comments'][rowID]['upvoters'][auth.currentUser.uid] = upvoterData
                            this.setState({ data, showingReplyBtn: false })
                          })
                        } }><Text style={{ textAlign: 'center', alignSelf: 'center', color: '#923E46', width: 30, fontSize: 12 }}>like</Text></TouchableOpacity>
                        <Text style={{ alignSelf: 'center', marginTop: -3, color: '#923E46', width: 5, fontSize: 12 }}>|</Text>
                        <TouchableOpacity onPress={() => {
                          this.setState({ showingReplyBtn: false, showingInput: true, replying: rowID })
                        } }><Text style={{ textAlign: 'center', alignSelf: 'center', color: '#923E46', width: 55, fontSize: 12 }}>comment</Text></TouchableOpacity>
                      </Animated.View> : null}

                    <View style={{ height: 30, width: 50, marginTop: -10, backgroundColor: 'white', position: 'absolute', right: -20 }}></View>

                    <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={() => {
                      if (this.state.showingReplyBtn !== rowID) {
                        this.setState({ replyMargin: new Animated.Value(-100), showingReplyBtn: rowID }, () => {
                          Animated.spring(
                            this.state.replyMargin,
                            {
                              toValue: 30,
                              friction: 8,
                            }
                          ).start()
                        })
                      } else {
                        Animated.spring(
                          this.state.replyMargin,
                          {
                            toValue: -100,
                            friction: 8,
                          }
                        ).start(() => this.setState({ showingReplyBtn: false }))
                      }
                    } }><Image source={require('../img/reply_icon.png')}></Image></TouchableOpacity>

                  </View>

                  {/** Comment Text */}
                  {rowData.bid ?
                    <Text style={{ fontWeight: '600', color: '#4a4a4a', marginLeft: 15 + 42, marginTop: -20, fontSize: 15 }}>Bid <Text style={{ color: '#cf2031' }}>{"$" + rowData.text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text></Text>
                    :
                    <Text style={{ color: '#4a4a4a', marginLeft: 15 + 42, marginTop: -20, fontSize: 15 }}>{rowData.text}</Text>
                  }
                  <Text style={{ color: '#929292', marginLeft: 15 + 42, marginTop: 5, fontSize: 12 }}><TimeAgo time={rowData.createdAt}></TimeAgo></Text>

                  {/*** Comment reply grey box */}
                  {rowData.replies || rowData.upvoters ?
                    <View style={{ marginTop: 8, marginLeft: 42, padding: 8, paddingTop: 3, borderRadius: 8, backgroundColor: '#F4F4F4' }}>

                      {/*** Upvoter Names */}
                      {rowData.upvoters ?
                        <View style={{ flexDirection: 'row', marginTop: 5, paddingBottom: rowData.replies ? 10 : 0, marginBottom: rowData.replies ? 5 : 0, borderColor: 'rgba(181, 128, 133, .57)', borderBottomWidth: rowData.replies ? 1 : 0 }}>
                          <View style={{ width: 15, height: 15 }}>
                            <Image source={require('../img/red_upvote.png')}></Image>
                          </View>

                          <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                            {
                              Object.keys(rowData.upvoters).map((upvoterID, idx) => {
                                if (idx === Object.keys(rowData.upvoters).length - 1) {
                                  return <TouchableOpacity key={idx} onPress={() => this.props.navigator.push({
                                    title: I18n.t('card'),
                                    screen: 'rprn.frPersonDetail',
                                    passProps: {
                                      handleAdd: () => { },
                                      detailId: upvoterID
                                    }
                                  })}><Text style={{ fontSize: 14, fontWeight: '600', color: '#923E46' }}>{rowData.upvoters[upvoterID].name}</Text></TouchableOpacity>
                                } else {
                                  return <TouchableOpacity key={idx} onPress={() => this.props.navigator.push({
                                    title: I18n.t('card'),
                                    screen: 'rprn.frPersonDetail',
                                    passProps: {
                                      handleAdd: () => { },
                                      detailId: upvoterID
                                    }
                                  })}><Text style={{ fontSize: 14, fontWeight: '600', color: '#923E46' }}>{rowData.upvoters[upvoterID].name + ', '}</Text></TouchableOpacity>
                                }
                              })}
                          </View>
                        </View> : null}

                      {/*** Replyer Name and Text */}
                      {rowData.replies ? Object.keys(rowData.replies).map((replyID, idx) =>
                        <View key={replyID} style={{ flexDirection: 'row', marginTop: 5 }}>
                          {rowData.replies[replyID].to ?
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity onPress={() => this.props.navigator.push({
                                title: I18n.t('card'),
                                screen: 'rprn.frPersonDetail',
                                passProps: {
                                  handleAdd: () => { },
                                  detailId: rowData.replies[replyID].author.uid
                                },
                                navigatorStyle: { tabBarHidden: true }
                              })}><Text style={{ fontWeight: '600', color: '#923E46' }}>{rowData.replies[replyID].author.name} </Text>
                              </TouchableOpacity>
                              <Text>to</Text>
                              <TouchableOpacity onPress={() => this.props.navigator.push({
                                title: I18n.t('card'),
                                screen: 'rprn.frPersonDetail',
                                passProps: {
                                  handleAdd: () => { },
                                  detailId: rowData.replies[replyID].to.uid
                                },
                                navigatorStyle: { tabBarHidden: true }
                              })}>
                                <Text style={{ fontWeight: '600', color: '#923E46' }}> {rowData.replies[replyID].to.name}: </Text>
                              </TouchableOpacity>
                            </View>
                            :
                            <View>
                              <TouchableOpacity onPress={() => this.props.navigator.push({
                                title: I18n.t('card'),
                                screen: 'rprn.frPersonDetail',
                                passProps: {
                                  handleAdd: () => { },
                                  detailId: rowData.replies[replyID].author.uid
                                },
                                navigatorStyle: { tabBarHidden: true }
                              })}><Text style={{ fontWeight: '600', color: '#923E46' }}>{rowData.replies[replyID].author.name}: </Text>
                              </TouchableOpacity>
                            </View>
                          }

                          <TouchableOpacity onPress={() => { this.setState({ replyingTo: rowData.replies[replyID].author, showingReplyBtn: false, showingInput: true, replying: rowID }) } }>
                            <Text style={{ fontSize: 14 }}>{rowData.replies[replyID].text}</Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View> : null}
                </View>
              }
              /> : null}

        </ScrollView>


        {this.state.showingInput ?
          <View style={{ bottom: 0, borderColor: '#F4F4F4', borderWidth: 1, height: 45, padding: 5, flexDirection: 'row' }} >
            <TextInput
              style={{ alignSelf: 'center', color: '#4A4A4A', flex: 1, fontSize: 15, height: 45, borderWidth: 0 }}
              returnKeyType='done'
              keyboardType={this.state.bidding ? 'numeric' : 'default'}
              autoFocus={true}
              placeholder={(() => {
                if (this.state.bidding) {
                  return "Your bid here"
                } else if (this.state.replyingTo) {
                  return "Replying to " + this.state.replyingTo.name
                } else {
                  return "Your comment here"
                }
              })()}
              onBlur={() => this.setState({ replyingTo: '', bidding: false, showingInput: false })}
              onChangeText={(v) => this.setState({ comment: v })}
              value={this.state.comment}
              onSubmitEditing={() => {
                if (this.state.replying) {
                  let replyData = this.state.replyingTo ?
                    {
                      to: this.state.replyingTo,
                      author: {
                        name: auth.currentUser.displayName,
                        avatar: auth.currentUser.photoURL,
                        uid: auth.currentUser.uid
                      },
                      text: this.state.comment
                    }
                    :
                    {
                      author: {
                        name: auth.currentUser.displayName,
                        avatar: auth.currentUser.photoURL,
                        uid: auth.currentUser.uid
                      },
                      text: this.state.comment
                    }
                  let ref = db.ref('fm_items/' + this.props.detailId + '/comments/' + this.state.replying + '/replies/').push()
                  ref.set(replyData).then(() => {
                    let data = this.state.data
                    data['comments'][this.state.replying]['replies'] = data['comments'][this.state.replying]['replies'] ? data['comments'][this.state.replying]['replies'] : {}
                    data['comments'][this.state.replying]['replies'][ref] = replyData
                    this.setState({ data, replyingTo: '', showingReplyBtn: false, comment: '', replying: false })
                  })
                } else {
                  let commentData = this.state.bidding ?
                    {
                      bid: 1,
                      author: {
                        name: auth.currentUser.displayName,
                        uid: auth.currentUser.uid,
                        avatar: auth.currentUser.photoURL
                      },
                      createdAt: timestamp,
                      text: this.state.comment
                    }
                    :
                    {
                      author: {
                        name: auth.currentUser.displayName,
                        uid: auth.currentUser.uid,
                        avatar: auth.currentUser.photoURL
                      },
                      createdAt: timestamp,
                      text: this.state.comment
                    }
                  let ref = db.ref('fm_items/' + this.props.detailId + '/comments/').push()
                  ref.set(commentData).then(() => {
                    let data = this.state.data
                    commentData['createdAt'] = Date.now()
                    data['comments'] = data['comments'] ? data['comments'] : {}
                    data['comments'][ref] = commentData
                    this.setState({ data, showingReplyBtn: false, comment: '' })
                  })
                }
              } }

              />
          </View>
          :
          <View style={{ backgroundColor: '#fafafa', flexDirection: 'row', bottom: 0, height: 45 }}>
            <TouchableOpacity style={{ borderTopWidth: 1, borderRightWidth: 1, borderColor: '#979797', height: 45, flex: 1 }} onPress={() => { this.setState({ showingInput: true, bidding: true }) } }>
              <Text style={{ lineHeight: 45, fontSize: 17, color: '#cf2031', alignSelf: 'center' }}>Bid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderTopWidth: 1, borderColor: '#979797', height: 45, flex: 1 }} onPress={() => { this.setState({ showingInput: true }) } }>
              <Text style={{ lineHeight: 45, fontSize: 17, color: '#cf2031', alignSelf: 'center' }}>Comment</Text>
            </TouchableOpacity>
          </View>
        }

        <KeyboardSpacer />
      </View>
    )
  }
}