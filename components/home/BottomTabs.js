import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Divider } from 'react-native-elements'
import React, { useEffect, useState } from 'react'

export const bottomTabIcons = [
  {
    name: 'Home',
    active: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/home.png',
    inactive: 'https://img.icons8.com/fluency-systems-regular/144/ffffff/home.png',
    navigationName: 'HomeScreen'
  },
  {
    name: 'Search',
    active: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/search.png',
    inactive: 'https://img.icons8.com/fluency-systems-regular/144/ffffff/search.png'
  },
  {
    name: 'Reels',
    active: 'https://img.icons8.com/ios-filled/500/ffffff/instagram-reel.png',
    inactive: 'https://img.icons8.com/ios/500/ffffff/instagram-reel.png'
  },
  {
    name: 'Shop',
    active: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/shopping-bag-full.png',
    inactive: 'https://img.icons8.com/fluency-systems-regular/144/ffffff/shopping-bag-full.png'
  },
  {
    name: 'Profile',
    active: 'https://img.icons8.com/material/24/ffffff/user-male-circle--v1.png',
    inactive: 'https://img.icons8.com/small/144/ffffff/user-male-circle.png',
    navigationName: 'ProfileScreen'
  },
]

const BottomTabs = ({icons, navigation, users}) => {
  const [activeTab, setActiveTab] = useState('Home')
  const Icon = ({icon, navigation}) => (
    
    <TouchableOpacity onPress={() => {setActiveTab(icon.name), navigation.navigate(icon.navigationName, {
          activeTab: activeTab,
          iconName: icon.name,
          user: users
        })}}>
      <Image source={{uri: activeTab == icon.name ? icon.active : icon.inactive}} style={
        styles.icon
      }/>
    </TouchableOpacity>
  )
  return (
    <View style={styles.wrapper}>
      <Divider width={1} orientation='vertical'/>
      <View style={styles.container}> 
        {icons.map((icon, index) =>(
          <Icon key={index} icon={icon} navigation={navigation}/>
        ))}
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: '3%',
    zIndex: 9,
    backgroundColor: '#000'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    height: 50
  },
  icon: {
    width: 30,
    height: 30
  }
})

export default BottomTabs