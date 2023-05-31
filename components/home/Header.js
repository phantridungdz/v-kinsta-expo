import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { firebase } from '../../firebase'

const handleSignout = async() => {
  try {
    await firebase.auth().signOut()
    console.log('Signed out successfully')
  }catch(error){
    console.log(error)
  }
}


const Header = ({navigation, users}) => {
  
  return (
      <View style={styles.container}>
      <TouchableOpacity onPress={handleSignout}>
        <Image 
          style={styles.logo}
          source={require('/Users/phantchase/Desktop/V-Kinsta/assets/header-logo.png')}
        />
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.push('NewPostScreen')}>
          <Image 
            style={styles.icon}
            source={{ uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/plus-2-math.png' }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image 
            style={styles.icon}
            source={{ uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/like--v1.png' }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', {
          users: users,
        })}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>11</Text>
          </View>
          <Image 
            style={styles.icon}
            source={{ uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/facebook-messenger.png' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
  },  
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: 'contain'
  },

  unreadBadge: {
    backgroundColor: '#FF3250',
    position: 'absolute',
    left: 20,
    bottom: 18,
    width: 25,
    height: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  unreadBadgeText: {
    color: 'white',
    fontWeight: '600',

  },
})

export default Header