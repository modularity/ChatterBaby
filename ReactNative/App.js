
import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  ActivityIndicator,
  View
} from 'react-native';
// import other pages to load into the navigation objects
import Graph from './common_modules/Graph';
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
      email: '',
      appReady: false,
    }
    firebase.analytics().setAnalyticsCollectionEnabled(true);

    // init admob once per app lifecycle with app id
    firebase.admob().initialize('ca-app-pub-4412913872988371/6451389174');
  }

  componentDidMount() {
    // check storage to determine routing
    this.checkRegistration();
  }

  async checkRegistration() {
    var consentLoading = true;
    var emailLoading = true;
    // uncomment line below to wipe storage for testing
    // AsyncStorage.clear();
    await AsyncStorage.getItem('consented')
      .then(val => this.setState({consented: val}))
      .catch(e => {
        Alert.alert('Start Error', 'Hmm something went wrong initializing the app.');
        firebase.analytics().logEvent('accessing_consent_init_error');
      })
      .done(() => consentLoading = false);
    await AsyncStorage.getItem('email')
      .then(val => this.setState({email: val}))
      .catch(e => {
        Alert.alert('Start Error', 'Hmm something went wrong initializing the app.');
        firebase.analytics().logEvent('accessing_email_init_error');
      })
      .done(() => emailLoading = false);
      if (consentLoading && emailLoading) this.setState({appReady: true});
  }

  render() {
    // spinner if still loading
    if (!this.state.appReady) return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#5f97cb" />
      </View>
    );
    // otherwise route to app
    return this.getRoute();
  }

  // dynamic route rendering based on consent/registration status
  getRoute() {
    var route = <ConsentNav navigator = {this.props.navigation} screenProps={{email: this.state.email}} />;
    if (this.state.email) { // email implies consent/registration completed
      route = <TabNav navigator={this.props.navigation} screenProps={{email: this.state.email}} />;
    } else if (this.state.consented) { // if consented but not registered
      route = <RegisterNav navigator={this.props.navigation} screenProps={{email: this.state.email}} />;
    }
    return route;
  }
}

const RecordNav = StackNavigator({
  Record: { screen: Record,
    navigationOptions: ({ navigation }) => ({
      header: null,
      }),
    },
  //Graph: { screen: Graph },
  Graph: { screen: Graph,
    navigationOptions: ({ navigation }) => ({
      title: 'Results',
      headerStyle: { backgroundColor: '#5f97cb' },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        color: '#fff',
      },
    }),
  }
});

const TabNav = TabNavigator({
  Record: { screen: RecordNav,
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
  },
  //swipeEnabled: true,
  //animationEnabled: true,
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
