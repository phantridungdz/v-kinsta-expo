import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Validator, validate } from 'email-validator'
import { useState } from 'react'
import { firebase } from '../../firebase'

const LoginForm = ({navigation}) => {
  const LoginFormSchema = Yup.object().shape({
    email: Yup.string().email().required('AN email is required'),
    password: Yup.string()
      .required()
      .min(8, 'Your password has to have at least 8 characters')
  })

  const onLogin = async(email , password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      console.log("Firebase login successfully", email, password)
    } catch(error) {
      Alert.alert('V-Kinsta', error.message + "\n\n... OK"),
      [
        {
          text: 'OK',
          onPress: () => console.log('Do you want create a new account ?'),
          style: 'cancel',
        },
        { text: 'Sign Up', onPress: () => navigation.push('SignupScreen')},
      ]
    }
  }

  return (
    <View style={styles.wrapper}>
      <Formik
      initialValues={{email: '', password: ''}}
      onSubmit={values => {
        onLogin(values.email, values.password)
      }}
      validationSchema={LoginFormSchema}
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
              // autoCapitalize='none'
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
              values.password.length < 1 || values.password.length > 5 ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Password'
              // autoCapitalize={false}
              secureTextEntry={true}
              textContentType='password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
          </View>
          <View style={{ alignItems: 'flex-end', marginBottom: 30}}>
            <Text style={{ color: '#6BB0F5'}}>Forgot password? </Text>
          </View>
          <Pressable 
            titleSize={20} 
            style={styles.button(isValid)} 
            onPress={handleSubmit}
            disabled={!isValid}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
          <View style={styles.sigupContainer}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={()=> navigation.push('SignupScreen')}>
              <Text style={{color: '#6BB0F5'}}> Sign Up</Text>
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

export default LoginForm