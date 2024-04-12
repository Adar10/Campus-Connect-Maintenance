  /**
 * Initializes the Firebase app with the provided configuration.
 * @function
 * @param {Object} firebaseConfig - The Firebase configuration object.
 * @returns {Object} The initialized Firebase app.
 */
import { initializeApp } from 'firebase/app';

/**
 * Gets the Firestore database instance.
 * @function
 * @returns {Object} The Firestore database instance.
 */
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';


/**
 * Gets the Firestore storage instance.
 * @function
 * @returns {Object} The Firestore storage instance.
 */
import { getStorage, ref, exists, getDownloadURL, uploadString, uploadBytes } from 'firebase/storage'

// Firebase configuration object
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

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get Firestore database instance
const db = getFirestore();

// Get a reference to the storage service
const storage = getStorage();

/**
 * Creates a new reference to the specified tenta.
 * @async
 * @function
 * @param {string} course - The name of the collection.
 * @param {string} category - The category/subfolder of the file.
 * @param {string} fileName - The name of the file.
 * @returns {Object|null} - Returns a reference to the file in Firebase Storage if it exists,
 * or null if the file does not exist or an error occurs.
 */
async function getFileRef(course, category, fileName) {
  try {

    // Create a ref
    const tentaRef = ref(storage, `${course}/${category}/${fileName}`);

    // Check if the file exists
    /*const exists = await tentaRef.exists();
    if (!exists[0]) {
      console.log("File does not exist");
      return null;
    }*/

    console.log("Reference created");
    return tentaRef;

  } catch (error) {
    console.error("Error creating reference:", error);
    return null;
  }
}

/**
 * Creates a new reference to the specified file.
 * @async
 * @function
 * @param {string} course - The name of the collection.
 * @param {string} category - The category/subfolder of the file.
 * @param {string} fileName - The name of the file.
 * @returns {Object|null} - A Promise that resolves with the download URL for this object,
 * or null if the file does not exist or an error occurs.
 */
async function getFileDownloadURL(course, category, fileName) {
  try {
    const fileRef = ref(storage, `${course}/${category}/${fileName}`);
    const downloadURL = await getDownloadURL(fileRef);
    console.log("Download URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error getting download URL:", error);
    return null;
  }
}

/**
 * Creates a new folder and subfolders for a course.
 * @async
 * @function
 * @param {string} courseName - The name of the collection.
 */
async function storageCreateCourse(courseName) {
  try {
    const storage = getStorage();
    const bucket = ref(storage);

    // Create the root folder if it doesn't exist
    const rootFolderPath = `${courseName}/`;
    await uploadString(ref(bucket, rootFolderPath), '');

    console.log("Root folder created (or already exists):", rootFolderPath);

    // List of subfolders to be created in the new course folder
    const subfolderNames = ['Kursmaterial', 'Quiz', 'Tentor', 'Vidoer'];

    // Iterate through the list of subfolder names and create them within the root folder
    for (const subfolderName of subfolderNames) {
      const subfolderPath = `${rootFolderPath}${subfolderName}/`;
      await uploadString(ref(bucket, subfolderPath), '');
      console.log("Subfolder created (or already exists):", subfolderPath);
    }
  } catch (error) {
    console.error("Error creating folders:", error);
  }
}



/**
 * Adds a new document to the specified collection.
 * @async
 * @function
 * @param {string} collectionName - The name of the collection.
 * @param {Object} data - The data to be added to the document.
 * @returns {string|null} The ID of the newly created document, or null if an error occurred.
 */
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

/**
 * Updates an existing document in the specified collection.
 * @async
 * @function
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document to be updated.
 * @param {Object} data - The updated data for the document.
 */
async function updateDocument(collectionName, docId, data) {
    try {
      const washingtonRef = doc(db, collectionName, docId);
      await updateDoc(washingtonRef, data);
      console.log("Update completed");
    } catch (error) {
      console.error("Error updating: ", error);
    }
}

/**
 * Reads documents from the specified collection based on a specific field and value.
 * @async
 * @function
 * @param {string} collectionName - The name of the collection.
 * @param {string} field - The field to filter documents by.
 * @param {any} value - The value to filter documents by.
 */
async function readDocuments(collectionName, field, value) {
    try {
      const q = query(collection(db, collectionName), where(field, "==", value));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
      });
    } catch (error) {
      console.error("Error reading: ", error);
    }
}

/**
 * Deletes a document from the specified collection.
 * @async
 * @function
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document to be deleted.
 */
async function deleteDocument(collectionName, docId) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      console.log("Deletion completed");
    } catch (error) {
      console.error("Error deleting: ", error);
    }
}

// Expose createDocument function globally for usage
window.createDocument = createDocument;

// Expose getFileDownloadURL function globally for usage
window.getFileDownloadURL = getFileDownloadURL;

// Expose storageCreateCourse function globally for usage
window.storageCreateCourse = storageCreateCourse;