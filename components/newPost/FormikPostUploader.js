import { View, TextInput, Text, Image , Button, TouchableOpacity, Platform, Alert} from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { Formik, formik } from 'formik'
import { Divider } from 'react-native-elements'
import validUrl from 'valid-url'
import { db, firebase } from '../../firebase'
import * as ImagePicker from 'expo-image-picker'
import storage from '@react-native-firebase/storage'


const PLACEHOLDER_IMG = 'https://cp.cuyahogacounty.us/Images/Placeholder-Image-Square.png'

const uploadPostSchema = Yup.object().shape({
  imageUrl: Yup.string().url().required('A URL is required'),
  caption: Yup.string().max(2200, 'Caption has reached')
})

const FormikPostUploader = ({ navigation }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMG)
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const getUsername = () => {
    const user = firebase.auth().currentUser
    const unsubcribe = db.collection('users').where('owner_uid', '==', user.uid).limit(1).onSnapshot(
      snapshot => snapshot.docs.map( doc => {
        setCurrentLoggedInUser({
          username: doc.data().username,
          profilePicture: doc.data().profile_picture
        })
      })
    )
    return unsubcribe
  }

  useEffect(() => {
    getUsername()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    });

    const imageUri = Platform.OS === 'ios' ? result.uri : result.path

    if (!result.cancelled) {
    setImage(imageUri);
    }
  }
  const submitPost = async () => {
    const uploadUri = image

    let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1)

    setUploading(true)

    try {
      storage().ref(filename).putFile(uploadUri)
      setUploading(false)
      Alert.alert('a','a')
    }catch(e){
      console.log(e)
    }
    setImage(null)
  }

  return (
    <Formik
      initialValues={{caption: '', imageUrl: ''}}
      onSubmit={values => {
        uploadPostToFirebase(values.imageUrl, values.caption)
      }}
      validationSchema={uploadPostSchema}
      validateOnMount={true}
    >
      {({ 
        handleBlur, 
        handleChange, 
        handleSubmit, 
        values, 
        errors, 
        isValid
      }) =>
        <>
          <View style={{ margin: 20, justifyContent: 'space-between', flexDirection: 'row'}}>
            <Image 
              source={{ uri: image }} 
              style={{ width: 100, height:100 }}
            />
            <TouchableOpacity onPress={pickImage }>
              <Text style={{color: 'white'}}>Select Single With Camera</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12}}>
              <TextInput 
                style={{color: 'white', fontSize: 20}}
                placeholder='Write a caption' 
                placeholderTextColor='gray'
                multiline={true}
                onChangeText={handleChange('caption')}
                onBlur={handleBlur('caption')}
                value={values.caption}
              />
            </View>
          </View>
          <Divider width={0.2} orientation='vertical'/>
          <TextInput 
              onChange={e => setThumbnailUrl(e.nativeEvent.text)}
              style={{color: 'white', fontSize: 20}}
              placeholder='Enter Image Url' 
              placeholderTextColor='gray'
              onChangeText={handleChange('imageUrl')}
              onBlur={handleBlur('imageUrl')}
              value={values.imageUrl}
          />
          {errors.imageUrl && (
            <Text style={{fontSize: 10, color: 'red'}}>
              {errors.imageUrl}
            </Text>
          )}
          <TouchableOpacity onPress={submitPost }>
              <Text style={{color: 'white'}}>Select Single With Camera</Text>
            </TouchableOpacity>
          <Button onPress={submitPost} title='Share' disabled={!isValid}/>
        </>
      }
    </Formik>
  )
}

export default FormikPostUploader