import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db, firebase } from '../../firebase'

const ChatList = ({chats, navigation}) => {
  const gotoMessage = user => {
    navigation.navigate('MessesageScreen', {
      user: user
    })
  }
  return (
    <>
      {chats.map(({id, data}) =>{
        const [userMessages, setUserMessages] = useState([])
        useEffect(() => {
          db.collectionGroup('users')
          .where('email', '==', data.id)
          .onSnapshot(snapshot => {
            setUserMessages(snapshot.docs.map(user => ({
              id: user.id,
              ...user.data(),
            })))
          })
        }, [])
        return(
        <TouchableOpacity onPress={() => gotoMessage(userMessages[0])}>
            <View style={{flexDirection: 'row',marginBottom: 20, maxWidth: '80%',}} key={id} >
            <Image 
              source={{ uri: data.profile_picture}} 
              style={{
                width: 50, 
                height: 50,
                borderRadius: 25
              }} 
            />
            <View style={{ margin: 10}}>
              <Text style={{flex: 150,color: 'white', fontWeight: '700'}}>{data.username}</Text>
              <Text style={{flex: 150,color: 'gray', fontWeight: '600', fontSize: 12}}>{data.lastMessage}</Text>
            </View>
            <Text></Text>
          </View>
        </TouchableOpacity>
        )
      })}
    </>
  )
}

export default ChatList