import { initializeApp } from "firebase/app"
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signInWithEmailAndPassword,
	updateProfile,
	sendPasswordResetEmail,
	fetchSignInMethodsForEmail,
} from "firebase/auth"
import t from "../resources.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBi7msHKn4oDHS1JZRFeMTbf5N0J-EbEA0",
	authDomain: "isav-solutions-authentication.firebaseapp.com",
	projectId: "isav-solutions-authentication",
	storageBucket: "isav-solutions-authentication.appspot.com",
	messagingSenderId: "694880018657",
	appId: "1:694880018657:web:b5e468a23ebf5f248417a0",
	measurementId: "G-69FP9SZEPL",
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

export const SetMessageByErrorCode = ({ languageCode, error }) => {
	switch (error.code) {
		case "auth/weak-password":
			error.message = t(languageCode, "weakPassword")
			break
		case "auth/invalid-email":
			error.message = t(languageCode, "invalidEmail")
			break
		case "auth/email-already-in-use":
			error.message = t(languageCode, "email_already_in_use")
			break
		case "auth/invalid-credential":
			error.message = t(languageCode, "email_or_password_incorrect")
			break
		case "auth/operation-not-supported-in-this-environment":
			error.message = t(languageCode, "authentication_environment_not_configured")
			break
		case "auth/too-many-requests":
			error.message = t(languageCode, "tooManyRequests")
			break
	}
}
