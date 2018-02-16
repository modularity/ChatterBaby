
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
// import Firebase for analytics and admob
import firebase from 'react-native-firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consented: false,
      registered: false,
      email: '',
    }
    firebase.analytics().setAnalyticsCollectionEnabled(true);

    // init admob once per app lifecycle with app id
    firebase.admob().initialize('ca-app-pub-4412913872988371/6451389174');
  }

  componentDidMount() {
    // check storage to determine routing
    this.checkConsent();

  }

  // pull list of all keys stored on device to determine routing
  // store may include: ['consentResponse': 'yes'],['registered': 'yes'], ['email': 'something@gmail.com']
  async checkConsent() {
    var consented = false;
    var registered = false;
    var email = '';
    try {
      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            var key = store[i][0];
            var val = store[i][1];
            if (key === 'email') {
              if (val) email = val;
            } else if (key === 'consentResponse') {
              if (val === 'yes') consent = true;
            } else if (key === 'registered') {
              if (val==='yes') registered = true;
            }
          });
        });
      });
    } catch (error) {
      // error retrieving AsyncStorage data
    }
    this.setState({consented, registered, email});
  }

  render() {
    // dynamic route rendering based on consent/registration status
    // check if email and registered okay to access the app

    var route = <ConsentNav navigator = {this.props.navigation} />;
    if (this.state.registered && this.state.email !== '') {
      route = <TabNav navigator = {this.props.navigation} />
    } else if (this.state.consented) { // have they at least consented
      route = <RegisterNav navigator = {this.props.navigation} />
    }
    return route;
    //return <TabNav navigator={this.props.navigation} screenProps={{ email: this.state.email}} />
    //return <RegisterNav navigator={this.props.navigation} screenProps={{ email: this.state.email}} />
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
              tabBarLabel: 'Survey',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="list-alt" size={25} color={tintColor} />
            }
         },
  AboutUs: { screen: AboutUs,
            navigationOptions: {
              tabBarLabel: 'About',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="group" size={25} color={tintColor} />
            }
        },
  ContactUs: { screen: ContactUs,
            navigationOptions: {
              tabBarLabel: 'Contact',
              tabBarIcon: ({ tintColor }) =>
                  <Icon name="envelope" size={25} color={tintColor} />
            }
        },
  Faq: { screen: Faq,
            navigationOptions: {
              tabBarLabel: 'FAQ',
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

// navigation object to route to consent form
const ConsentNav = StackNavigator({
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

// navigation object to route to Register
const RegisterNav = StackNavigator({
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
