import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db, firebase } from '../../firebase'
import ImageGallery from './ImageGallery'

const Gallery = ({user}) => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    db.collectionGroup('posts')
    .where('owner_email', '==', user.email)
    .orderBy('createAt')
    .onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(post => ({
        id: post.id,
        ...post.data()
      })))
    })
  }, [])
  return (
    <FlatList
      style={{flexDirection: 'row'}}
      data={posts}
      numColumns={3}
      keyExtractor={(item) => item.id}
      renderItem={({ item: message }) =>{
        console.log(message)
        return (
          <ImageGallery key={message.id} message={message}/>
        )
      }}
    >
    </FlatList>
  )
}

export default Gallery