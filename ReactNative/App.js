
import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
// import other pages to load into the navigation objects
import Record from './common_modules/Record';
import Questionnaire from './common_modules/Questionnaire';
import AboutUs from './common_modules/AboutUs';
import ContactUs from './common_modules/ContactUs';
import Faq from './common_modules/Faq';
import Eula from './common_modules/Eula';
import Register from './common_modules/Register';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import FontAwesome icons for navigation objects
import Icon from 'react-native-vector-icons/FontAwesome';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { registered: false }
  }

  componentDidMount() {
    // check storage to determine routing
    this.checkConsent();
  }

  async checkConsent() {
    try {
      const consentVal = await AsyncStorage.getItem('consentResponse');
      if (consentVal !== null) {
        // they have agreed to consent form
        this.setState({registered: true});
        // check if registration was completed
        const registerVal = await AsyncStorage.getItem('registered');
        if (registerVal === 'complete') {
          //console.log('agreed to eula AND registered');
        } else {
          //console.log('agreed to eula, but not registered');
        }
      }
    } catch (error) {
      // error retrieving AsyncStorage data
    }
  }

  render() {
    // dynamic route rendering based on consent/registration status
    var route = this.state.registered ? <TabNav navigator = {this.props.navigation} />
                           : <RegisterNav navigator = {this.props.navigation} />
    return route
    /* fixed nav obj render for testing
      return <TabNav navigator = {this.props.navigation} />
      return <RegisterNav navigator = {this.props.navigation} />
    */
  }
}

const TabNav = TabNavigator({
  Record: { screen: Record,
            navigationOptions: {
              tabBarLabel: 'Record',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="microphone" size={25} color={tintColor} />
            }
          },
  Questionnaire: { screen: Questionnaire,
            navigationOptions: {
              tabBarLabel: 'Questionnaire',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="list-alt" size={25} color={tintColor} />
            }
         },
  AboutUs: { screen: AboutUs,
            navigationOptions: {
              tabBarLabel: 'AboutUs',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="group" size={25} color={tintColor} />
            }
        },
  ContactUs: { screen: ContactUs,
            navigationOptions: {
              tabBarLabel: 'ContactUs',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="envelope" size={25} color={tintColor} />
            }
        },
  Faq: { screen: Faq,
            navigationOptions: {
              tabBarLabel: 'Faq',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="list" size={25} color={tintColor} />
            }
        },
}, {
  tabBarOptions: {
    activeTintColor: '#fff',
    activeBackgroundColor: '#fdba31',
    inactiveTintColor: '#fff',
    inactiveBackgroundColor: '#5f97cb'
  }
});

// add navigation object to route to consent form
// may also add registration form to follow EULA consent
const RegisterNav = StackNavigator({
  Eula: { screen: Eula,
    navigationOptions: ({ navigation }) => ({
      header: null,
      }),
    },
  Register: { screen: Register,
    navigationOptions: ({ navigation }) => ({
      header: null,
      }),
    },
  TabNav: { screen: TabNav,
    navigationOptions: ({ navigation }) => ({
      header: null,
      }),
    },
});
