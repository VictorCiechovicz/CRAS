import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAOEVW9wM4WAhT3dpaK6TdWiQjBB2FBRqY',
  authDomain: 'cras-app.firebaseapp.com',
  projectId: 'cras-app',
  storageBucket: 'cras-app.appspot.com',
  messagingSenderId: '1073390747936',
  appId: '1:1073390747936:web:63fd2c274538aeb0e05745',
  measurementId: 'G-DNT4T9CJXQ'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
