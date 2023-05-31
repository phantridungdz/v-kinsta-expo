import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Validator, validate } from 'email-validator'
import { useState } from 'react'
import { db, firebase } from '../../firebase'

const SignupForm = ({navigation}) => {
  const SignupFormSchema = Yup.object().shape({
    email: Yup.string().email().required('AN email is required'),
    username: Yup.string().required().min(2,'A username is required'),
    password: Yup.string()
      .required()
      .min(8, 'Your password has to have at least 8 characters')
  })

  const getRandomProfilePicture = async () => {
    const response = await fetch('https://randomuser.me/api')
    const data = await response.json()
    return data.results[0].picture.large
  }

  const onSignup = async( email, password, username) => {
    try {
      const authUser = await firebase.auth().createUserWithEmailAndPassword(email, password)

      db.collection('users').doc(authUser.user.email).set({
        owner_uid: authUser.user.uid,
        username: username,
        email: authUser.user.email,
        profile_picture: await getRandomProfilePicture(),

      })
    } catch(error) {
      Alert.alert('Error: ', error.message)
    }
  }
  return (
    <View style={styles.wrapper}>
      <Formik
      initialValues={{email: '', username: '', password: ''}}
      onSubmit={values => {
        onSignup(values.email, values.password, values.username)
      }}
      validationSchema={SignupFormSchema}
      validateOnMount={true}
      >
      {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
        <>
          <View style={[
            styles.inputField,
            {
              borderColor: 
              values.email.length < 1 || validate(values.email) ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Phone number, username or email'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              autoFocus={true}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
          </View>
          <View style={[
            styles.inputField,
            {
              borderColor: 
              values.username.length < 1 || values.username.length > 1 ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Username'
              autoCapitalize='none'
              textContentType='username'
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
          </View>
          <View style={[
            styles.inputField,
            {
              borderColor: 
              values.password.length < 1 || values.password.length > 5 ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Password'
              autoCapitalize={false}
              secureTextEntry={true}
              textContentType='password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
          </View>
          <Pressable 
            titleSize={20} 
            style={styles.button(isValid)} 
            onPress={handleSubmit}
            disabled={!isValid}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <View style={styles.sigupContainer}>
            <Text>Already an account?</Text>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <Text style={{color: '#6BB0F5'}}> Log in</Text>
            </TouchableOpacity>
          </View>
        </>
        )}
      </Formik>
    </View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },

  inputField: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    borderWidth: 1,
  },

  button: (isValid) => ({
    backgroundColor: isValid ? '#0096F6' : '#9ACAF7',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 4,
  }),

  buttonText: {
    fontWeight: '600',
    color: '#FFF',
    fontSize: 20,

  },

  sigupContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 50,
  }
})

export default SignupForm