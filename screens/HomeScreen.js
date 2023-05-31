import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Stories from '../components/home/Stories'
import Post from '../components/home/Post'
import { POSTS } from '../data/posts'
import BottomTabs, { bottomTabIcons } from '../components/home/BottomTabs'
import { db, firebase } from '../firebase'

const HomeScreen = ({navigation}) => {
  const currentLoggedUser = firebase.auth().currentUser
  const [users, setUsers] = useState([])
  useEffect(() => {
    db.collectionGroup('users')
    .where('email', '==', currentLoggedUser.email)
    .onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(user => ({
        id: user.id,
        ...user.data(),
      })))
    })
  }, [])
  const [posts, setPosts] = useState([])
  useEffect(() => {
    db.collectionGroup('posts')
    .orderBy('createAt')
    .onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(post => ({
        id: post.id,
        ...post.data()
      })))
    })
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} users={users[0]}/>
      <Stories navigation={navigation}/>
      <ScrollView>
        {posts.map((post, index) =>(
          <Post post={post} key={index} users={users[0]} navigation={navigation}/>
        ))}
      </ScrollView>
      <BottomTabs icons={bottomTabIcons} navigation={navigation} users={users[0]}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})

export default HomeScreen