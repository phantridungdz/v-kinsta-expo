import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import SignupForm from '../components/signup/SignupForm'

const INSTAGRAM_LOGO = 'https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Instagram-512.png'

const SignupScreen = ({navigation}) => (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image source={{uri: INSTAGRAM_LOGO, height: 100, width: 100}}/>
    </View>
    <SignupForm navigation={navigation}/>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 12,
  },

  logoContainer: {
    alignItems: 'center',
    backgroundColor:'white',
    marginTop: 60,
  },
})


export default SignupScreen