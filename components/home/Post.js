import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect} from 'react'
import { Divider } from 'react-native-elements'
import { db, firebase } from '../../firebase'


const postFooterIcons = [
  {
    name: 'Like',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/like.png',
    likedImageUrl: 'https://img.icons8.com/fluency/96/000000/hearts.png'
  },
  {
    name: 'Comment',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/topic.png',
  },
  {
    name: 'Share',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/paper-plane.png',
  },
  {
    name: 'Save',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/bookmark-ribbon--v1.png',
  },
]
const Post = ({ post, navigation, users }) => {
  const [userOwners, setUserOwner] = useState([])
  useEffect(() => {
    db.collectionGroup('users')
    .where('email', '==', post.owner_email)
    .onSnapshot(snapshot => {
      setUserOwner(snapshot.docs.map(userOwner => ({
        id: userOwner.id,
        ...userOwner.data(),
      })))
    })
  }, [])
  

  const handleGotoProfile = users => {
    navigation.navigate('ProfileScreen', {
      user: userOwners[0]
    })
  }
  
  const handleLike = post => {
    const currentLikeStatus = !post.likes_by_users.includes(
      firebase.auth().currentUser.email
    )

    db.collection('users')
    .doc(post.owner_email)
    .collection('posts')
    .doc(post.id)
    .update({
      likes_by_users: currentLikeStatus 
      ? firebase.firestore.FieldValue.arrayUnion(
          firebase.auth().currentUser.email
      )
      : firebase.firestore.FieldValue.arrayRemove(
        firebase.auth().currentUser.email
      ),
    })
    .then(()=>{
      console.log('Document successfully updated!')
    })
    .catch( error => {
      console.error('Error updating documnet: ', error)
    })
  }
  return (
    <View style={{ marginBottom: 30}}>
      <Divider width={1} orientation='vertical' />
      <PostHeader post={post} handleGotoProfile={handleGotoProfile} userOwners={userOwners}/>
      <PostImage post={post} />
      <View style={{marginHorizontal: 15, marginTop:10}}>
        <PostFooter post={post} handleLike={handleLike} users={users} navigation={navigation} />
        <Likes post={post} />
        <Caption post={post}/>
        <CommentsSection post={post}/>
        <Comments post={post} />
      </View>
    </View>
  )
}

const PostHeader = ({post, handleGotoProfile, userOwners}) => (
  <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 5, alignItems: 'center'}}>
    <TouchableOpacity onPress={() => handleGotoProfile(userOwners)}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: post.profile_picture }} style={styles.story}/>
        <Text style={{ color: 'white', marginLeft: 5, fontWeight: '700'}} > {post.username}</Text>
      </View>
    </TouchableOpacity>
    <Text style={{ color: 'white', fontWeight: '900'}}>...</Text>
  </View>
)

const PostImage = ({post}) => (
  <View style={{
    width: '100%',
    height: 450,
  }}>
    <Image 
      source={{uri: post.imageUrl}} 
      style={{height: '100%', resizeMode: 'cover'}} 
    />
  </View>
  
)

const PostFooter = ({handleLike, post, navigation, users}) => {
  return (
    <View style={{ flexDirection: 'row'}}>
      <View style={styles.leftFooterIconsContainer}>
        <TouchableOpacity onPress={() => handleLike(post)}>
          <Image style={styles.footerIcon} source={{uri: post.likes_by_users.includes(
            firebase.auth().currentUser.email
            ) ? postFooterIcons[0].likedImageUrl
            : postFooterIcons[0].imageUrl
            }}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', {
          users: users,
          post,
        })}>
            <Image style={styles.footerIcon} source={{ uri: postFooterIcons[1].imageUrl}}/>
        </TouchableOpacity>
        
        <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[2].imageUrl}/>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end'}}>
        <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[3].imageUrl}/>
      </View>
    </View>
  )
}

const Icon = ({imgStyle, imgUrl}) => (
  <TouchableOpacity>
    <Image style={imgStyle} source={{ uri: imgUrl}} />
  </TouchableOpacity>
)

const Likes = ({ post }) => (
  <View style={{ marginTop: 5}}>
    <Text style={{flexDirection: 'row', marginTop: 4}}>
      <Text style={{color: 'white', fontWeight: '600'}}>
        {post.likes_by_users.length.toLocaleString('en')} likes
      </Text>
  </Text>
  </View>
  
)

const Caption = ({post}) => (
  <Text style={{ color: 'white'}}>
    <Text style={{ fontWeight: '600'}}>{post.user}</Text>
    <Text> {post.caption}</Text>
  </Text>
)

const CommentsSection = ({post}) => {
  return(
    <View style={{ marginTop: 5}}>
    {!!post.comments.length && (
      <Text style={{ color: 'gray'}}>
        View{post.comments.length > 1 ? ' all' : ''} {post.comments.length}{' '}
        {post.comments.length > 1 ? 'comments' : 'comment'}
      </Text>
      )}
    </View>
  )
}

const Comments = ({ post }) => (
  <>
    {post.comments.map((comment, index) =>(
      <View key={index} style={{ flexDirection: 'row', marginTop: 5}} >
        <Text style={{color: 'white'}}>
          <Text style={{fontWeight: '600'}}>{comment.user}
          </Text>{' '}
           {comment.comment}
        </Text>
      </View>
    ))}
  </>
)

const styles = StyleSheet.create({
  story: {
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

export default Post