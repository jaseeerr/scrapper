import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCTNSICrgUNKdrBlsAeO_p1yLDb5JVxj98",
  authDomain: "honordubai-93add.firebaseapp.com",
  projectId: "honordubai-93add",
  storageBucket: "honordubai-93add.appspot.com",
  messagingSenderId: "860803765438",
  appId: "1:860803765438:web:b16b788717bc3500527aef",
  measurementId: "G-TPEB0YT6LF"
}

export default firebaseConfig

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
const analytics = getAnalytics(app)
const provider = new GoogleAuthProvider()

export const SignInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
};