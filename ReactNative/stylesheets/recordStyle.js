import {StyleSheet, Dimensions} from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
module.exports =  StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'space-between',
    //alignItems: 'center',
    //backgroundColor: '#fff',
  },
  recordButton: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#fff'
  },
  button: {
    padding: 20
  },
  recordContainer: {
    flex: 1,
    justifyContent:'center',
    margin: 10,
  },
  resultContainer: {
    flex: 1,
    //justifyContent: 'space-between',
    //alignItems: 'stretch',
    //justifyContent: 'center',
    margin: 10,
  },
  closeContainer: {
    margin: 20,
    //justifyContent: 'flex-end',
    //alignItems: 'flex-end',
  },
  cancelButton: {
    justifyContent: 'flex-end',
    //alignItems: 'center',
    //alignSelf: 'center',
    padding: 10,
    backgroundColor: '#5f97cb',
    borderRadius: 5,
    width: 35,
    height: 35,
  },
  disabledButtonText: {
    padding: 20,
    color: '#eee'
  },
  inactiveButtonText: {
    fontSize: 25,
    color: '#2b608a'
  },
  activeButtonText: {
    fontSize: 25,
    color: '#fdba31'
  },
  modalMsgContainer: {
   flex: .6,
   justifyContent:'center',
   alignItems: 'center',
   alignSelf: 'center',
 },
 modalClose: {
   width: width*.8,
   backgroundColor: '#f1592a',
   padding: 5,
 },
 modalHeader: {
   flex: .6,
   width: width*.8,
   backgroundColor: '#f1592a',
   justifyContent: 'center',
   alignItems: 'center',
 },
 infoRadius: {
   borderWidth:2,
   borderColor:'#ecf0f1',
   alignItems:'center',
   justifyContent:'center',
   width:100,
   height:100,
   backgroundColor:'#fff',
   borderRadius:100,
 },
 modalTxtContainer: {
   width: width*.8,
   backgroundColor: '#ecf0f1',
   flex: .3,
   justifyContent: 'center',
   alignItems: 'center',
 },
  h1Text: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Avenir',
    textAlign: 'center',
    alignSelf: 'center',
    margin: 3,
    color: '#34495e',
    backgroundColor: 'transparent',
  },
  confirmBtn: {
    backgroundColor: '#b3d1f2',
    borderRadius: 15,
    padding: 8,
    margin: 8
  },
  optLabelPicker: {
    justifyContent: 'center',
    //width: "80%"
    //height: 200,
  },
  itemStyle: {
    fontSize: 15,
    height: 75,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  labelsList: {
    alignSelf: 'center',
    width: width*.5,
    height: height*.8,
    margin: 10,
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    alignSelf: 'center',
    margin: 3,
    color: '#34495e',
    backgroundColor: 'transparent',
  },
  labelText: {
    fontSize: 18,
    fontFamily: 'Avenir',
    textAlign: 'center',
    alignSelf: 'center',
    color: '#34495e',
    backgroundColor: 'transparent',
  },
  feedbackText: {
    margin: 10,
    fontSize: 12,
    fontFamily: 'Avenir',
    color: '#34495e',
  }
});
