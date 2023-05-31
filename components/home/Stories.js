import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { USERS } from '../../data/users'
import { db, firebase } from '../../firebase'

const Stories = ({navigation}) => {
  const currentLoggedUser = firebase.auth().currentUser
  const [users, setUsers] = useState([])
  useEffect(() => {
    db.collectionGroup('users')
    .where('email', '!=', currentLoggedUser.email)
    .onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(user => ({
        id: user.id,
        ...user.data(),
      })))
    })
  }, [])
  const handleGotoProfile = userOwners => {
    navigation.navigate('ProfileScreen', {
      user: userOwners
    })
  }
  return (
    <View style={{ marginBottom: 13}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {users.map((story, index) => (
          <TouchableOpacity key={index} onPress={() => handleGotoProfile(story)}>
            <View  style={{alightItems: 'center'}}>
              <Image source={{uri: story.profile_picture}} style={styles.story}/>
              <Text style={{ color: 'white'}}>
              {story.username.length > 11 
              ? story.username.slice(0, 10).toLocaleLowerCase() + '...'
              : story.username.toLocaleLowerCase()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  story: {
    width:  70,
    height: 70,
    borderRadius: 35,
    margin: 5,
    borderWidth: 4,
    borderColor: 'white'
  }
})

export default Stories