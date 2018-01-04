import React, { Component } from 'react'
import I18n from '../utils/I18n'
import { Navigation } from 'react-native-navigation'
import { registerScreens } from './screens'
registerScreens()

import { db, auth, getUser } from '../utils/firebase'

auth.onAuthStateChanged(user => {
  if (user) {

    //main app
    console.log("starting main")
    startMain()

  } else {
    console.log("logged out")
    startLogin()
  }
})

const startLogin = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'rprn.login',
      title: I18n.t('login'),
      navigatorButtons: {
        rightButtons: [
          {
            title: I18n.t('register'),
            id: 'register'
          }
        ]
      },
      navigatorStyle: {
        navBarNoBorder: true,
        navBarButtonColor: 'white',
        navBarTextColor: 'white',
        navBarBackgroundColor: '#cf2031',
        statusBarTextColorScheme: 'light'
      }
    }
  })
}

const startMain = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'rprn.fmMain',
      title: I18n.t('fm'),
      navigatorButtons: {
        rightButtons: [
          {
            title: I18n.t('create'),
            id: 'create'
          }
        ]
      },
      navigatorStyle: {
        navBarNoBorder: true,
        navBarButtonColor: 'white',
        navBarTextColor: 'white',
        navBarBackgroundColor: '#cf2031',
        statusBarTextColorScheme: 'light'
      }
    }  
  })
}