import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

let fApp: firebase.app.App

export function initialize(){
    fApp = firebase.initializeApp(firebaseConfig)
}

export const db = ()=>firebase.firestore(fApp);

export const storage = ()=>fApp.storage().ref()

export default {
    initialize,
    db,
    storage
}