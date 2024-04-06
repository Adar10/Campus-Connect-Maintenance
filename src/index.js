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
      console.log(doc.id)
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

async function getCourses() {
  const snapshot = await getDocs(collection(db, "kurser"));
  return snapshot.docs.map(doc => doc.data());
}

async function generateCourseNavigation() {
  const courses = await getCourses();
  console.log(courses);
  const nav = document.getElementById("navigation");
  courses.forEach(course => {
      const link = document.createElement("a");
      link.href = 'root.html?content=${encodeURIComponent(course.name)}'; // Include content name as a query parameter
      link.textContent = course.name; // Assuming course has a "name" field
      link.addEventListener('click', () => {
        sessionStorage.setItem('contentName', course.name); // Set content name in session storage
      });
      nav.appendChild(link);
  });
}

document.addEventListener("DOMContentLoaded", function() {
    try{
      generateCourseNavigation();
      console.log("tried");
    } catch (error) {
      console.error("Error creating document", error);
    }
});




