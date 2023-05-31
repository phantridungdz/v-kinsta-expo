import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyC_apgW6Aqj27KarwfSq9yvz4oguPb_7Xc",
  authDomain: "v-kinsta.firebaseapp.com",
  projectId: "v-kinsta",
  storageBucket: "v-kinsta.appspot.com",
  messagingSenderId: "729302811381",
  appId: "1:729302811381:web:5bd0bff21589c144e8bbbc"
}

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const db = firebase.firestore()

export {firebase, db}