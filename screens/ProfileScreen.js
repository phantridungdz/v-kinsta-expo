import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db, firebase } from '../firebase'
import { Button } from 'react-native-elements'
import Gallery from '../components/profile/Gallery'

const ProfileScreen = ({navigation, route}) => {
  const {user} = route.params
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
  const gotoMessage = user => {
    navigation.navigate('MessesageScreen', {
      user: user
    })
  }
  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
      <Header navigation={navigation} users={user}>
      </Header>
      <View style={{flexDirection: 'row'}}>
        <Image source={{ uri: user.profile_picture}} style={{ width: 100, height: 100, borderRadius: 50, left: 20}}></Image>
        <View style={{alignItems: 'center', left: 60, flexDirection: 'row', justifyContent: 'space-around', width: 200}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'white', fontWeight:'900'}}>21</Text>
            <Text style={{color: 'white', fontWeight:'400', fontSize: 11}}>Bài viết</Text>
          </View>
          <View style={{alignItems: 'center', left: 20}}>
            <Text style={{color: 'white', fontWeight:'900', }}>21</Text>
            <Text style={{color: 'white', fontWeight:'400', fontSize: 11}}>Người theo dõi</Text>
          </View>
          <View style={{alignItems: 'center', left: 40}}>
            <Text style={{color: 'white', fontWeight:'900'}}>21</Text>
            <Text style={{color: 'white', fontWeight:'400', fontSize: 11}}>Đang theo dõi</Text>
          </View>
        </View>
      </View>
      {currentLoggedUser.email == user.email
      ? <View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: '', margin: 10}}>
          <View style={{borderWidth: 0.5, flex:1 ,borderColor: 'gray', borderRadius: 5, padding: 5, marginRight: 5}}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Edit Profile</Text>
          </View>
          <View style={{borderWidth: 0.5,  borderColor: 'gray', borderRadius: 5, padding: 5}}>
            <Image source={{uri: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/add.png'}} style={{ width: 21, height: 21}}></Image>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
          <View style={{flex:1, padding: 5, marginRight: 5}}>
            <Text style={{color: 'white', textAlign: 'left', fontWeight: '700', fontSize: 12, padding:2}}>Discover people</Text>
          </View>
          <View style={{flex:1, padding: 5, marginRight: 5}}>
            <Text style={{color: 'white', textAlign: 'right', color: '#1698f5', fontWeight: '700', fontSize: 12, padding:2}}>See all</Text>
          </View>
        </View>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {users.map((profile, index) => (
              <TouchableOpacity onPress={() => handleGotoProfile(profile)}>
                <View style={{alightItems: 'center', width: 160, height: 200, alignItems: 'center', justifyContent:'center', borderWidth: 0.2, borderColor: 'gray', margin: 5.5}}>

                    <Image source={{uri: profile.profile_picture}} style={styles.profile}/>
                    <Text style={{ color: 'white'}}>
                    {profile.username.length > 11 
                    ? profile.username.slice(0, 10).toLocaleLowerCase() + '...'
                    : profile.username.toLocaleLowerCase()}
                    </Text>
                    <TouchableOpacity style={{textAlign: 'bottom'}}>
                      <View style={{borderWidth: 0.5,borderColor: 'gray', borderRadius: 5, padding: 5, paddingLeft:20, paddingRight: 20, marginTop: 10, backgroundColor: '#1698f5'}}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Follow</Text>
                      </View>
                    </TouchableOpacity>
                  
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Gallery user={user}></Gallery>
        </View>
      </View>
      
      :
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: '', margin: 10}}>
          <View style={{borderWidth: 0.5, flex: 1, borderColor: 'gray', backgroundColor: '#1698f5', borderRadius: 5, padding: 5, marginRight: 5}}>
              <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Follow</Text>
          </View>
          <TouchableOpacity style={{flex: 1}} onPress={()=> gotoMessage(user)}>
            <View style={{borderWidth: 0.5 ,borderColor: 'gray', borderRadius: 5, padding: 5, marginRight: 5}}>
              <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Message</Text>
            </View>
          </TouchableOpacity>
          
          <View style={{borderWidth: 0.5,  borderColor: 'gray', borderRadius: 5, padding: 5}}>
            <Image source={{uri: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/add.png'}} style={{ width: 21, height: 21}}></Image>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
          <View style={{flex:1, padding: 5, marginRight: 5}}>
            <Text style={{color: 'white', textAlign: 'left', fontWeight: '700', fontSize: 12, padding:2}}>Discover people</Text>
          </View>
          <View style={{flex:1, padding: 5, marginRight: 5}}>
            <Text style={{color: 'white', textAlign: 'right', color: '#1698f5', fontWeight: '700', fontSize: 12, padding:2}}>See all</Text>
          </View>
        </View>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {users.map((profile, index) => (
              <TouchableOpacity onPress={() => handleGotoProfile(profile)}>
                <View style={{alightItems: 'center', width: 160, height: 200, alignItems: 'center', justifyContent:'center', borderWidth: 0.2, borderColor: 'gray', margin: 5.5}}>

                    <Image source={{uri: profile.profile_picture}} style={styles.profile}/>
                    <Text style={{ color: 'white'}}>
                    {profile.username.length > 11 
                    ? profile.username.slice(0, 10).toLocaleLowerCase() + '...'
                    : profile.username.toLocaleLowerCase()}
                    </Text>
                    <TouchableOpacity style={{textAlign: 'bottom'}}>
                      <View style={{borderWidth: 0.5,borderColor: 'gray', borderRadius: 5, padding: 5, paddingLeft:20, paddingRight: 20, marginTop: 10, backgroundColor: '#1698f5'}}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Follow</Text>
                      </View>
                    </TouchableOpacity>
                  
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Gallery user={user}></Gallery>
        </View>
      </View> 
      }
    </SafeAreaView>
  )
}
const Header = ({navigation, users}) => (
  <View style={styles.headerContrainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <View>
          <Image source={{ uri: 'https://img.icons8.com/material/24/ffffff/back--v1.png'}} style={{ width: 35, height: 35}}></Image>
        </View>
    </TouchableOpacity>
    <Text style={styles.headerText}>{users.username}</Text>
    
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
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
  profile: {
    margin: 10,
    width:  70,
    height: 70,
    borderRadius: 35,
    margin: 5,
  }
})

export default ProfileScreen