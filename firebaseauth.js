
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDpocFCTfx9lxOEgeobzFdj040uZVlx_k0",
    authDomain: "pocketclass---assignment.firebaseapp.com",
    projectId: "pocketclass---assignment",
    storageBucket: "pocketclass---assignment.firebasestorage.app",
    messagingSenderId: "887511757022",
    appId: "1:887511757022:web:49705ad8f0d8831d84d24f"
  };


  const app = initializeApp(firebaseConfig);

  const signUp= document.getElementById('submitSignUp');
  signUp.addEventListener('click' , (event)=>{
    event.preventDefault();
  })
