import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createSwitchNavigator } from 'react-navigation';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen'
import HomeScreen from './screens/HomeScreen';
import * as Font from 'expo-font';
import AppLoadingScreen from './screens/LoadingScreen';
import { Alert } from 'react-native';
const SwitchNavigator = createSwitchNavigator({
  Home:HomeScreen,
  SignUp:SignUpScreen,
  SignIn:SignInScreen,
})
const AppContainer = createAppContainer(SwitchNavigator);

export default class App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {fontsLoaded:false}
  }
  async LoadFonts()
  {
   await Font.loadAsync({
    "Axiforma":require('./assets/fonts/axiforma-semi-bold.otf')
   }).then(()=>
   {
    this.setState({fontsLoaded:true});
   }).catch(()=>
   {
    Alert.alert("Unknown Error", "An unknown error has ocurred while loading the app, please try again later...");
   })
  }
  componentDidMount()
  {
    this.LoadFonts();
  }
  render()
  {
    if (!this.state.fontsLoaded)
    {
      return <AppLoadingScreen/>
    }
    return <AppContainer/>
  }
}