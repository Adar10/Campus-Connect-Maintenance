import { initializeApp } from 'firebase/app';
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

const db = getFirestore();


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


// Delete a document
async function deleteDocument(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log("Deletion completed");
  } catch (error) {
    console.error("Error deleting: ", error);
  }
}

