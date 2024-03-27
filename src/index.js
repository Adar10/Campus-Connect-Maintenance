import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';


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

const db = getFirestore();

function signInWithGoogle() { 
    const GoogleProvider = new GoogleAuthProvider(); 
    signInWithPopup(auth, GoogleProvider).then((result) => { 
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

auth.onAuthStateChanged((user) => {
  if(user) {
      console.log("User is signed in");
  } else {
    console.log("User is signed out");
  }
})

window.addEventListener('DOMContentLoaded', (event) => {
  // Now you can safely use `createDocument` in your HTML
  document.getElementById("clickme").addEventListener("click", async function() {
      try {
        const data = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 30,
      };
    
      const docRef = await addDoc(collection(db, "test"), data);
      console.log("Document created", docRef.id);
  } catch (error) {
      console.error("Error creating document", error);
  }
  });
});

// Create a document
async function createDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document created", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating ", error);
    return null;
  }
}

// Read documents
async function readDocuments(collectionName, field, value) {
  try {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // TODO: Use read data
    });
  } catch (error) {
    console.error("Error reading: ", error);
  }
}

// Update a document
async function updateDocument(collectionName, docId, data) {
  try {
    const washingtonRef = doc(db, collectionName, docId);
    await updateDoc(washingtonRef, data);
    console.log("Update completed");
  } catch (error) {
    console.error("Error updating: ", error);
  }
}

// Delete a document
async function deleteDocument(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log("Deletion completed");
  } catch (error) {
    console.error("Error deleting: ", error);
  }
}

