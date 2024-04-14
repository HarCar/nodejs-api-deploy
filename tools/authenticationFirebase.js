import { initializeApp } from 'firebase/app'
import {
  getAuth, createUserWithEmailAndPassword, sendEmailVerification,
  signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, fetchSignInMethodsForEmail
} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCUvvSh2K8IIlqf_wVMsc-JqRBjxE680Mw',
  authDomain: 'isav-e597d.firebaseapp.com',
  projectId: 'isav-e597d',
  storageBucket: 'isav-e597d.appspot.com',
  messagingSenderId: '892926121785',
  appId: '1:892926121785:web:ce325a8bf0f3058237bae8',
  measurementId: 'G-Y1P49X25SH'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const CreateUserWithEmailAndPassword = async ({ name, email, password }) => {
  const auth = getAuth(app)
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(userCredential.user, { displayName: name })
  await sendEmailVerification(userCredential.user)
  return { success: true, userCredential }
}

export const SignInWithEmailAndPassword = async (email, password) => {
  const auth = getAuth(app)
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  if (!userCredential.user.emailVerified) {
    await sendEmailVerification(userCredential.user)
  }
  return { success: true, userCredential }
}

export const SendPasswordResetEmail = async ({ email }) => {
  const auth = getAuth(app)
  await sendPasswordResetEmail(auth, email)
}

export const FetchSignInMethodsForEmail = async ({ email }) => {
  const auth = getAuth(app)
  const signInMethods = await fetchSignInMethodsForEmail(auth, email)

  return signInMethods
}
