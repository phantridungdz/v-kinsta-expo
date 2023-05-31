import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Button, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db, firebase } from '../firebase'
import Comment from '../components/comment/Comment'

const CommentScreen = ({route, navigation}) => {
  const { users } = route.params;
  const { post } = route.params;
  const [input, setInput] = useState("");
  
  // console.log (post.comments[0])
  const [comments, setComments] = useState([])
  useEffect(() => {
    db.collectionGroup('comments')
    .where("post_id", '==', post.id)
    // .where(firebase.firestore.FieldPath.documentId(), '==', itemId)
    .onSnapshot(snapshot => {
      setComments(snapshot.docs.map(comment => ({
        id: comment.id,
        ...comment.data()
      })))
    }) 
  }, [])

  const sendComment = () => {
    db.collection('users')
      .doc(post.owner_email)
      .collection('posts')
      .doc(post.id)
      .collection('comments')
      .add({
        comment: input,
        like: 0,
        profile_picture: userCurrent[0].profile_picture,
        username: userCurrent[0].username,
        post_id: post.id
      })
      .then(()=>{
        console.log('Document successfully updated!')
      })
      .catch( error => {
        console.error('Error updating documnet: ', error)
      })
      setInput('')
  };
  
  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
      <Header navigation={navigation}>
      </Header>
        <ScrollView>
          {comments.map((comment, index) =>(
            <Comment comment={comment} key={index} />
          ))}
        </ScrollView>
      <KeyboardAvoidingView  
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{flex: 'row'}}
      keyboardVerticalOffset={10}>
        
        <View style={{
          flexDirection: 'row',
        }}>
        <Image 
          source={{ uri: users.profile_picture}} 
          style={{
            flex: 1,
            width: 35, 
            height: 35,
            borderRadius: 15
          }} 
        />
        <View style={{
          marginLeft: 10,
          marginRight: 10,
          flex:11,
          flexDirection: 'row', 
          borderWidth: 0.5, 
          borderColor: 'gray',
          borderRadius: 20,
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
                placeholder={"Send Comment.."}
                onChangeText={setInput}
                value={input}
            >
              
            </TextInput>
            <TouchableOpacity onPress={() => sendComment()} style={{justifyContent: 'center', marginRight: 10}} >
              <Text style={{color: '#088ecc'}}>Send</Text>
            </TouchableOpacity>
            {/* <Button style={{marginRight: 10}} onPress={sendComment} title="Send" color="#088ecc" /> */}
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
  )
}

const Header = ({navigation}) => (
  <View style={styles.headerContrainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <View>
          <Image source={{ uri: 'https://img.icons8.com/material/24/ffffff/back--v1.png'}} style={{ width: 35, height: 35}}></Image>
        </View>
    </TouchableOpacity>
    <Text style={styles.headerText}>Comments</Text>
    <Text></Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  headerContrainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  headerText: {
    alignItems: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginRight: 25,
  },

})

export default CommentScreen