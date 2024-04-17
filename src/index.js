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
    });    // button.style.width = "20rem";

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





window.generateCourseNavigation = generateCourseNavigation;




