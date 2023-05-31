import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

const Comment = ({ comment, navigation }) => {
  return (
    <View style={{ marginBottom: 30}}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: comment.profile_picture }} style={styles.story}/>
        <View style={{ flex: 12}}>
          
          <Text style={{ color: 'white', }}><Text style={{ fontWeight: '600'}}>{comment.username} </Text>{comment.comment} </Text>
        </View>
      </View>
    </View>
  )
}
// console.log(comment.comment)

const styles = StyleSheet.create({
  story: {
    flex: 1,
    width:  35,
    height: 35,
    borderRadius: 35,
    margin: 6,
    borderWidth: 1.6,
    borderColor: 'white'
  },

  footerIcon: {
    width:  33,
    height: 33,
    margin: 3
  },

  // footerIcon: {
  //   transform: [{rotate: '320deg'}],
  //   marginTop: -3,
  // },

  leftFooterIconsContainer: {
    flexDirection: 'row',
    width: '32%',
    justifyContent: 'space-between'
  }
})

export default Comment