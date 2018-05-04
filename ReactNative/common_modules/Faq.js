import React, { Component } from 'react';
import {NetInfo,View, ScrollView,Linking,WebView, Text,TouchableOpacity} from 'react-native';
// import styleSheets
import styles from '../stylesheets/faqStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';
// import FontAwesome to support custom err msg modal
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Faq extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://www.chatterbaby.org/pages/mobile-display/faq',
    }
    firebase.analytics().setCurrentScreen('faq');
  }

  render() {
    return (
      <View style={styles.container}>
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{uri: this.state.url}}
        style={styles.webView}
        renderError={this.renderOfflineText}
        onNavigationStateChange={(event) => {
          if (event.url !== this.state.url) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
      </View>
    );
  }
  renderOfflineText = () => {
    return (<View style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}> FAQ </Text>
      <Text style={styles.boldText}>
      1)    What is ChatterBaby?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      ChatterBaby is an algorithm that helps you determine whether and why your baby is crying, by
      translating your baby’s cry into a need. It translates by analyzing the specific sounds that your
      baby makes when he or she is crying and comparing them with over 2,000 other sounds in our
      infant sound database.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      2)    What kinds of cries does ChatterBaby predict?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      Using machine learning and artificial intelligence, it will translate your baby’s cry into one of
      three needs: fussy, hungry, or pain. If your baby is crying because he really, really, wants to eat
      some Legos and you just won’t let him (true story), it will not work. We are adding other states
      such as colic, gassy, dirty diaper, scared, and bored, once we have enough evidence to show
      these states are reliably different. Sad fact: most colic cries are predicted as “pain” by our
      algorithm.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      3)    How accurate is ChatterBaby?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      ChatterBaby correctly captures and predicts “crying” (vs babbling or laughing) approximately
      90% of the time. Furthermore, it can translate with over 90% accuracy whether a new baby’s
      cry is due to pain when they actually are experiencing pain (vaccinations, ear-piercings).  True
      pain cries usually have high pain ratings (&gt;80%). When the algorithm’s predictions are closely
      tied, always consider the second-place choice.  When using the algorithm to analyze a sound
      clip, you should use data with minimal background noise, and then apply your own judgement.
      If you feed ChatterBaby a sound clip of you singing to your crying infant it will not work. If you
      feed ChatterBaby a sound clip of your dog barking, it will not work.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      4)    Can I trust the ChatterBaby algorithm to predict pain?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      You can trust ChatterBaby to translate ~ 90% of the time whether your baby’s reason for crying
      is because she is experiencing some degree of pain.  True “Pain” cries usually have very high
      Pain ratings (&gt;80%).  However, your parental instincts and intuition are far more powerful than
      our fanciest equations. If the ChatterBaby translation and your common sense disagree, always
      trust your own judgment.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      5)    The ChatterBaby algorithm said my baby isn’t in pain. Does that mean she’s healthy?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      ChatterBaby can only tell you if your baby is crying because she’s in acute pain – it cannot
      provide any insight into whether your baby is healthy or sick, whether it’s an emergency or not,
      whether you should call your doctor even though its 3am. Our algorithm never made it into
      med school, but your doctor thankfully did! If you think your baby is sick, always call your
      doctor (yes, even at 3am)! ChatterBaby is not meant to be used as a substitute for appropriate
      medical care.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      6)    How can I make ChatterBaby work better on my baby?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      The ChatterBaby algorithm can actually be personalized specifically for your baby!  Within the
      app, select “Teach ChatterBaby about Your Baby” to label your baby’s cry for us- what does
      your intuition say the cry reason is?  By sending us audio or video clips of your baby crying along
      with a description of why (e.g. he’s hungry vs. he just got his vaccines vs. his big brother scared
      him by wearing a clown mask), we can “teach” the algorithm the unique nuances of your baby’s
      cry and optimize its predictive accuracy.
      If you’re interested in a personalized ChatterBaby for your infant, you can also donate your
      baby’s cry recordings online through https://bit.ly/2jieI5q
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      7)    What happens to my data?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      Anytime you predict using ChatterBaby, you are sending your audio data to UCLA along with
      any other data you provide (baby’s age, etc..) and are consenting to be in our research study.
       We store it for science on a server that is HIPAA-compliant; the data is “de-identified,” which
      means that we remove information that links your data to you individually. We are interested
      in discovering whether abnormal vocalization patterns in infants can predict
      neurodevelopmental delays such as autism spectrum disorder. In order to do so, we need to
      analyze thousands of audio samples from thousands of babies. For more information, please
      refer to the Consent Form and our privacy policy that you acknowledged and accepted when
      launching the app: link to consent.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      8)    Is there a warranty?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      Nope. Nein. Zero. Zilch. Nada.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      9)    Is this a medical device?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      This is not a medical device. See also “Can I trust the ChatterBaby algorithm?“ above.
{'\n'}{'\n'}
      </Text>
      <Text style={styles.boldText}>
      10)   Who do I contact for more information?
      </Text>
      <Text style={styles.pageText}>{'\n'}
      Please contact Dr. Ariana Anderson at arianaanderson@mednet.ucla.edu. Please also visit
      ChatterBaby.org for a complete list of credits to whom ChatterBaby is indebted, as well as
      project updates, contact information, and lots more!
      </Text>
    </ScrollView>
    </View>);
  }
}
