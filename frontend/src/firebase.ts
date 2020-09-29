import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPKUVoG8JcCnVSD6Tl3WEUOpY6aM6VTEE",
  authDomain: "engineer-ability-visualizer.firebaseapp.com",
  databaseURL: "https://engineer-ability-visualizer.firebaseio.com",
  projectId: "engineer-ability-visualizer",
  storageBucket: "engineer-ability-visualizer.appspot.com",
  messagingSenderId: "610336105243",
  appId: "1:610336105243:web:722741fac5b9cf2964e9be"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const FirebaseFactory = () => {
  let auth = firebase.auth();
  return {
    auth,

    create(email: string, password: string) {
      return auth.createUserWithEmailAndPassword(email, password);
    },

    login(email: string, password: string) {
      return auth.signInWithEmailAndPassword(email, password);
    },

    logout() {
      return auth.signOut();
    },
  };
};

export default FirebaseFactory();