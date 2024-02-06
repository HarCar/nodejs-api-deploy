import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDwq-plzELqkdxiB1P3NPzF8_PvZxeeHuQ',
  authDomain: 'isav-authentication.firebaseapp.com',
  projectId: 'isav-authentication',
  storageBucket: 'isav-authentication.appspot.com',
  messagingSenderId: '341751603351',
  appId: '1:341751603351:web:ee59187467ed6c14b3c9d2',
  measurementId: 'G-0EPWEV1TXJ'
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
