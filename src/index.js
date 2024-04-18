import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc, count, get, getDoc } from 'firebase/firestore';
import { getStorage, ref, exists, getDownloadURL, uploadString, uploadBytes } from 'firebase/storage';

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

const storage = getStorage();

async function getFileDownloadURL(path) {
  try {
    const fileRef = ref(storage, path);
    const downloadURL = await getDownloadURL(fileRef);
    console.log("Download URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error getting download URL:", error);
    return null;
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
    link.href = 'lectures.html'; // Include content name as a query parameter
    link.textContent = course.name; // Assuming course has a "name" field
    link.addEventListener('click', () => {
      localStorage.setItem("course", course.name);
      localStorage.setItem("ID", course.ID);
    });
    link.style.textDecoration = "none";
    link.style.color = "black";

    const h5 = document.createElement("h5");

    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "btn-lg");
    button.style.marginRight = "2rem";
    button.style.marginTop = "2rem";
    button.addEventListener('click', () => {
      window.location.href = 'lectures.html';
      localStorage.setItem("course", course.name);
    });
    // button.style.width = "20rem";

    //const div_container = document.createElement("div");
    //div_container.classList.add("card", "container", "mt-5");
    // div_container.style.width = "20rem";

    // const div_body = document.createElement("div");
    // div_body.classList.add("card-body");

    h5.appendChild(link);
    button.appendChild(h5);
    nav.appendChild(button);

    // div_body.appendChild(h5);
    // div_container.appendChild(div_body);
    //nav.appendChild(div_container);
    nav.style.width = "100%";
  });
}

async function generateCourseExams() {

  var courseID = localStorage.getItem("ID");
  console.log(courseID);

  const docRef = doc(db, "1MS005", "Tentor");
  const docSnap = await getDoc(docRef);
  console.log(docSnap);
  const row = document.getElementById("exams");


  if (docSnap) {
    const data = docSnap.data();
    if (data) {
      // Iterate over each field in the document's data
      for (const fieldName in data) {

        const arrayField = data[fieldName];
        console.log(arrayField[0]);

        const card_container = document.createElement("div");
        card_container.classList.add("card", "container", "mt-5");
        card_container.style.width = "20rem";


        const card_body = document.createElement("div");
        card_body.classList.add("card-body");


        const name = document.createElement("h5");
        name.textContent = arrayField[0];

        const button = document.createElement("button");
        const link = getFileDownloadURL(arrayField[1]);
        console.log(link);
        button.textContent = "Click to open";
        button.classList.add("btn", "btn-primary", "btn-lg");
        button.addEventListener('click', () => {
          window.open(link);
        });

        card_body.appendChild(name);
        card_body.appendChild(button);
        card_container.appendChild(card_body);
        row.appendChild(card_container);


      }
    }
  } else {
    console.log("No such document!");
  }


}




window.generateCourseExams = generateCourseExams;
window.generateCourseNavigation = generateCourseNavigation;




