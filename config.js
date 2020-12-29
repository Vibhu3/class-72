import * as firebase from 'firebase';
require ('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyBLtkOdQ4omNPuMrjuDSl2qjEFMlAWmor8",
    authDomain: "willy-e45bf.firebaseapp.com",
    projectId: "willy-e45bf",
    storageBucket: "willy-e45bf.appspot.com",
    messagingSenderId: "1091957751016",
    appId: "1:1091957751016:web:6416bf6614269997d95d5d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()