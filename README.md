# ChatterBaby

## ChatterBaby Installation

### init React Native build
react-native init ChatterBaby

### configure repo
cd ChatterBaby 
git clone git@github.com:modularity/ChatterBaby.git  
cp -R ReactNative/* ChatterBaby

### configure project dependencies
npm install && react-native link

### configure iOS(cocoapod) dependencies
cd ios 
brew install cocoapods 
pod install

### iOS project configurations
Open ChatterBaby/ios/ChatterBaby.xcworkspace with Xcode
Configure Apple certificates then set signing information

### run iOS project
Run in Xcode or commandline with react-native run-ios in project root

### run android project
Start emulator or connect physical device first, then run react-native run-android
Alternatively, react-native start in project root then start project with Android Studio
