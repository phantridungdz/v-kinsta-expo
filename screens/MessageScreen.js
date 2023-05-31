import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, Button, TouchableWithoutFeedback, FlatList, Keyboard } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { db, firebase } from '../firebase'
import ReceiverMessage from '../components/chat/ReceiverMessage'
import SenderMessage from '../components/chat/SenderMessage'


const MessesageScreen = ({navigation, route}) => {
  const {user} = route.params
  const [input, setInput] = useState("");
  const currentLoggedUser = firebase.auth().currentUser
  

  const [userCurrent, setUserCurrent] = useState()
  useEffect(() => {
    db.collectionGroup('users')
    .where('email', '==', currentLoggedUser.email)
    .onSnapshot(snapshot => {
      setUserCurrent(snapshot.docs.map(user => ({
        id: user.id,
        ...user.data(),
      })))
    })
  }, [])
  const [messages, setMessages] = useState([])
  useLayoutEffect(() => {
    const unsub = db
    .collection('users')
    .doc(user.email)
    .collection('chat')
    .doc(currentLoggedUser.email)
    .collection('messages')
    .orderBy('createAt')
    .onSnapshot((snapshot) => setMessages(
      snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }))
    ))
    return unsub
  }, [route])
  
  const sendMessage = () => {
    
    if(input != ''){
      db.collection('users')
      .doc(user.email)
      .collection('chat')
      .doc(userCurrent[0].email)
      .collection('messages')
      .add({
        email: userCurrent[0].email,
        message: input,
        profile_picture: userCurrent[0].profile_picture,
        createAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: userCurrent[0].owner_uid
      })
      .then(()=>{
        db.collection('users')
        .doc(user.email)
        .collection('chat')
        .doc(userCurrent[0].email)
        .set({
          id: userCurrent[0].email,
          username: userCurrent[0].username,
          profile_picture: userCurrent[0].profile_picture,
          lastMessage: input,
        })
        .then(()=>{
          db.collection('users')
          .doc(userCurrent[0].email)
          .collection('chat')
          .doc(user.email)
          .collection('messages')
          .add({
            email: userCurrent[0].email,
            message: input,
            profile_picture: userCurrent[0].profile_picture,
            createAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: userCurrent[0].owner_uid

          }).then(()=>{
            db.collection('users')
            .doc(userCurrent[0].email)
            .collection('chat')
            .doc(user.email)
            .set({
              id: user.email,
              username: user.username,
              profile_picture: user.profile_picture,
              lastMessage: input,
            })
          })
        })
      })
      .catch( error => {
        console.error('Error updating documnet: ', error)
      })
    }
    setInput('')
  };
  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
      <Header navigation={navigation} users={user}>
      </Header>
      <View width={20}><Text></Text></View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView>
            {messages.map(({id, data}) =>
              data.email === userCurrent[0].email ? (
                <View key={id} style={styles.reciever}>
                  <Text style={{color: 'white', fontWeight: '700'}}>{data.message}</Text>
                </View>
              ):(
                <View style={{flexDirection: 'row', maxWidth: '80%',}} key={id} >
                  <Image 
                    source={{ uri: data.profile_picture}} 
                    style={{
                      width: 35, 
                      height: 35,
                      borderRadius: 15
                    }} 
                  />
                  <View style={styles.sender}>
                    <Text style={{flex: 150,color: 'white', fontWeight: '700'}}>{data.message}</Text>
                  </View>
                  <Text></Text>
                </View>
              )
            )}
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}   keyboardVerticalOffset={10}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#232224',
          borderRadius: 20,
        }}>
        <Image
        source={{ uri: 'https://platinmods.com/attachments/open-camera-v1-48-2-mod-adfree-apk-png.244753/'}}
          style={{
            flex: 1,
            width: 35, 
            height: 35,
            borderRadius: 15
          }} 
        />
        <View style={{
          marginRight: 10,
          flex:11,
          flexDirection: 'row', 
          justifyContent: 'space-between'
        }}>
            
            <TextInput
                style={{
                  maxWidth: 300,
                  marginLeft: 10,
                  paddingLeft: 8,
                }}
                color='white'
                placeholderTextColor="white"
                placeholder={"Send Message.."}
                onChangeText={setInput}
                value={input}
            >
              
            </TextInput>
            <TouchableOpacity onPress={() => sendMessage()} style={{justifyContent: 'center', marginRight: 10}} >
              <Text style={{color: '#088ecc', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>
            {/* <Button style={{marginRight: 10}} onPress={sendComment} title="Send" color="#088ecc" /> */}
          </View>
          
        </View>
        {/* <View style={{ flex: 'row'}}>
          <TextInput
              color='white'
              onChangeText={setInput}
              placeholderTextColor="white"
              placeholder="Send Message.."
              value={input}
          />
          <Button onPress={sendMessage} title="Send" color="#FF5864" />
        </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const Header = ({navigation, users}) => (
  <View style={styles.headerContrainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={{alignItems: 'center',}}>
          <Image source={{ uri: 'https://img.icons8.com/material/24/ffffff/back--v1.png'}} style={{ width: 35, height: 35}}></Image>
        </View>
    </TouchableOpacity>
    <Image source={{ uri: users.profile_picture}} style={{ width: 38, height: 38, borderRadius: 50, borderColor: 'white', borderWidth: 2}}></Image>
    <Text style={styles.headerText}>{users.username}</Text>
    
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  reciever: {
    padding: 12,
    backgroundColor: '#7630e6',
    alignSelf: 'flex-end',
    borderRadius: 30,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative'
  },
  sender: {
    marginLeft: 10,
    padding: 12,
    backgroundColor: '#4f4d54',
    alignSelf: 'flex-start',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    position: 'relative'
  },
  headerContrainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginRight: 25,
    margin: 10
  },

})

export default MessesageScreen