// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DatabaseURL,
  projectId: process.env.NEXT_PUBLIC_ProjectId,
  storageBucket: process.env.NEXT_PUBLIC_StorageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_MessagingSenderId,
  appId: process.env.NEXT_PUBLIC_AppId,
  //measurementId: "G-VNHHHX7E76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//const analytics = getAnalytics(app);

//signin with phone
//hidden captcha
export const captchaVerifier = () => {
  const recaptchaVerifier = new RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
      callback: () => {
        //console.log("hello1");
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        //console.log({ response });
        //onSignInSubmit();
      },
    },
    auth
  );

  return recaptchaVerifier;
};

//send code
export const signInWithPhone = async (phone, captchaVerifier) => {
  const response = await signInWithPhoneNumber(auth, phone, captchaVerifier);
  return response;
};

//signin with email
export const signInWithGmail = async () => {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  console.log({ response });
  return response.user;
};
