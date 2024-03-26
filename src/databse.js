import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAjWnGy2HpTFM-07fRp3VIokULmU_dyMg4",
    authDomain: "campusconnect-30c4a.firebaseapp.com",
    databaseURL: "https://campusconnect-30c4a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "campusconnect-30c4a",
    storageBucket: "campusconnect-30c4a.appspot.com",
    messagingSenderId: "728123265116",
    appId: "1:728123265116:web:2d24f83a222e156fe4d699",
    measurementId: "G-YRMP4KDMNX"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

function signInWithGoogle() { 
    const provider = new GoogleAuthProvider(); 
    signInWithPopup(auth, provider).then((result) => { 
    const user = result.user; 
    console.log(user); }) 
    .catch((error) => { console.error(error); }); 
}

function signOutWithGoogle() {
    auth.signOut().then(() => {
        console.log("Signed out");
    }).catch((error) => {
        console.error(error);
    });
}


document.getElementById("googleSignInButton").addEventListener("click", signInWithGoogle);
document.getElementById("googleSignOutButton").addEventListener("click", signOutWithGoogle);


auth.onAuthStateChanged((user) => {
    if(user) {
        console.log("User is signed in");
        toggleText();
    } else {
        console.log("User is signed out");
        toggleText();
    }
})

function toggleText() {
    var text = document.getElementById("login_info");
    if (text.style.display === "block") {
      text.style.display = "none";
    } else {
      text.style.display = "block";
    }
}