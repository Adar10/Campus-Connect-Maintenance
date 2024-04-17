import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createDocument, updateDocument, readDocuments, deleteDocument } from './src/frame2';
jest.mock('firebase/app');
jest.mock('firebase/firestore');

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

initializeApp.mockReturnValue({});

const db = getFirestore();

const testCollectionName = "testCollection";
const testDocumentId = "testDocumentId";
const testDocumentData = { name: "Test Document" };
const testUpdateData = { name: "Updated Test Document" };

describe("Database Tests", () => {
  test("Create Document", async () => {
    addDoc.mockImplementation(() => Promise.resolve({ id: testDocumentId }));

    const docId = await createDocument(testCollectionName, testDocumentData);

    expect(docId).toEqual(testDocumentId);
    expect(addDoc).toHaveBeenCalledWith(collection(db, testCollectionName), testDocumentData);
  });

  test("Update Document", async () => {
    updateDoc.mockImplementation(() => Promise.resolve());

    await updateDocument(testCollectionName, testDocumentId, testUpdateData);

    expect(updateDoc).toHaveBeenCalledWith(doc(db, testCollectionName, testDocumentId), testUpdateData);
  });

  test("Read Documents", async () => {
    getDocs.mockImplementation(() => Promise.resolve({
      forEach: (callback) => callback({ id: testDocumentId, data: () => testDocumentData }),
    }));

    await readDocuments(testCollectionName, "field", "value");

    expect(getDocs).toHaveBeenCalledWith(query(collection(db, testCollectionName), where("field", "==", "value")));
  });

  test("Delete Document", async () => {
    deleteDoc.mockImplementation(() => Promise.resolve());

    await deleteDocument(testCollectionName, testDocumentId);

    expect(deleteDoc).toHaveBeenCalledWith(doc(db, testCollectionName, testDocumentId));
  });
});
