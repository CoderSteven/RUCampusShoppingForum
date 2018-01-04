import {Navigation} from 'react-native-navigation'

import Login from './login'
import Register from './register'
import FmMain from './fmMain'
import FmItemCreate from './fmItemCreate'
import FmItemDetail from './fmItemDetail'
import FmItemList from './fmItemList'
import FrPersonDetail from './frPersonDetail'
import MeMain from './meMain'
import Gallery from 'react-native-gallery'

export function registerScreens() {
  Navigation.registerComponent('rprn.login', () => Login)
  Navigation.registerComponent('rprn.register', () => Register)
  Navigation.registerComponent('rprn.fmMain', () => FmMain)
  Navigation.registerComponent('rprn.fmItemCreate', () => FmItemCreate)
  Navigation.registerComponent('rprn.fmItemDetail', () => FmItemDetail)
  Navigation.registerComponent('rprn.fmItemList', () => FmItemList)
  Navigation.registerComponent('rprn.frPersonDetail', () => FrPersonDetail)    
  Navigation.registerComponent('rprn.meMain', () => MeMain)       
  Navigation.registerComponent('rprn.gallery', () => Gallery)    
}
