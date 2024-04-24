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
      console.log(courseID);
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

    h5.appendChild(link);
    button.appendChild(h5);
    nav.appendChild(button);

    nav.style.width = "100%";
  });
}

async function generateCourseExams() {

  var courseID = localStorage.getItem("ID");
  console.log(courseID);

  const docRef = doc(db, courseID, "Exams");
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
        button.textContent = "Click to open";
        button.classList.add("btn", "btn-primary", "btn-lg");
        button.addEventListener('click', async () => {
          try {
            const URL = await getFileDownloadURL(arrayField[1]);
            window.open(URL);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
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

async function generateCourseLectures() {

  var courseID = localStorage.getItem("ID");
  console.log(courseID);

  const docRef = doc(db, courseID, "Lectures");
  const docSnap = await getDoc(docRef);
  console.log(docSnap);
  const row = document.getElementById("lectures");


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

        const desc = document.createElement("p");
        desc.textContent = arrayField[2];

        const button = document.createElement("button");
        button.textContent = "Click to open";
        button.classList.add("btn", "btn-primary", "btn-lg");
        button.addEventListener('click', async () => {
          try {
            const URL = await getFileDownloadURL(arrayField[1]);
            window.open(URL);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        });

        card_body.appendChild(name);
        card_body.appendChild(desc);
        card_body.appendChild(button);
        card_container.appendChild(card_body);
        row.appendChild(card_container);


      }
    }
  } else {
    console.log("No such document!");
  }


}

async function generateCourseVideos() {

  var courseID = localStorage.getItem("ID");
  console.log(courseID);

  const docRef = doc(db, courseID, "Videos");
  const docSnap = await getDoc(docRef);
  console.log(docSnap);
  const row = document.getElementById("videos");


  if (docSnap) {
    const data = docSnap.data();
    if (data) {
      // Iterate over each field in the document's data
      for (const fieldName in data) {

        const arrayField = data[fieldName];
        console.log(arrayField[0]);

        const iframe = document.createElement("iframe");
        iframe.width = "400px"
        iframe.height = "315px"
        iframe.src = arrayField[0];
        iframe.title = "hejsan";
        iframe.frameborder = "0"
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.setAttribute('allowFullScreen', '');
        iframe.style.margin = "3rem";



        row.appendChild(iframe);

      }
    }
  } else {
    console.log("No such document!");
  }
}

async function generateUpload() {
  const courses = await getCourses();
  const div_start = document.getElementById("upload");

  courses.forEach(course => {
    console.log(course.name + " has ID: " + course.ID);

    const card_container = document.createElement("div");
    card_container.classList.add("card", "container", "mt-5")
    card_container.style.width = "20rem";

    const card_body = document.createElement("div");
    card_body.classList.add("card-body");

    const name = document.createElement("h5");
    name.textContent = course.name;

    const file = document.createElement("input");
    file.classList.add("form-control");
    file.id = "formFileLg";
    file.type = "file";

    const fileName = document.createElement("input");
    fileName.classList.add("form-control");
    fileName.id = "fileName";
    fileName.type = "text";
    fileName.placeholder = "Name of file";


    const fileDesc = document.createElement("input");
    fileDesc.classList.add("form-control");
    fileDesc.id = "fileDesc";
    fileDesc.type = "text"
    fileDesc.placeholder = "Description of file";

    const div_input = document.createElement("div");
    div_input.classList.add("input-group");

    const select = document.createElement("select");
    select.classList.add("custom-select");
    select.id = "inputGroupSelect04";
    select.style.flex = "1";

    const opt_type = document.createElement("option");
    opt_type.setAttribute('selected', '');
    opt_type.textContent = "Choose data type"

    const opt_1 = document.createElement("option");
    opt_1.value = "1";
    opt_1.textContent = "Lectures";

    const opt_2 = document.createElement("option");
    opt_2.value = "2";
    opt_2.textContent = "Videos";

    const opt_3 = document.createElement("option");
    opt_3.value = "3";
    opt_3.textContent = "Quizzes";

    const opt_4 = document.createElement("option");
    opt_4.value = "4";
    opt_4.textContent = "Exams";

    const div_append = document.createElement("div");
    div_append.classList.add("input-group-append");

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-primary");
    btn.type = "button";
    btn.textContent = "Submit";
    btn.addEventListener('click', async () => {
      try {
        submitFile(course.ID);
      } catch (error) {
        console.error("Error getting download URL:", error);
      }
    });



    div_start.appendChild(card_container);
    card_container.appendChild(card_body);
    card_body.appendChild(name);
    card_body.appendChild(file);
    card_body.appendChild(fileName);
    card_body.appendChild(fileDesc);
    card_body.appendChild(div_input);
    div_input.appendChild(select);
    select.appendChild(opt_type);
    select.appendChild(opt_1);
    select.appendChild(opt_2);
    select.appendChild(opt_3);
    select.appendChild(opt_4);
    div_input.appendChild(btn);

  });
}

/**
* Uploads a file and creates a firestore reference.
* @async
* @function
* @param {string} collectionID - The collection ID.
* @param {string} category - The type of file.
* @param {string} fileName - File name, included ."type" (Example: .PDF).
* @param {string} desc - The file description.
* @param {File} file - The file object selected by the user.
*/
async function uploadFile(collectionID, category, fileName, desc, file) {
  try {
    const storageRef = ref(storage, `${collectionID}/${category}/${fileName}`);
    addArrayFieldToDocument(collectionID, category, fileName, `${collectionID}/${category}/${fileName}`, desc);
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded file succesfully");
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

/**
 * Adds an array field with information inside a given document in a given collection.
 * @async
 * @function
 * @param {string} collectionID - The collection ID.
 * @param {string} documentName - The document name.
 * @param {string} fieldValue1 - Array index 0 value.
 * @param {string} fieldValue2 - Array index 1 value.
 * @param {string} fieldValue3 - Array index 2 value.
 */
async function addArrayFieldToDocument(collectionID, documentName, fieldValue1, fieldValue2, fieldValue3) {
  try {
    const docRef = doc(db, collectionID, documentName);
    await setDoc(docRef, {
      [fieldValue1]: [fieldValue1, fieldValue2, fieldValue3]
    }, { merge: true });
    console.log("Array field added/updated successfully");
  } catch (error) {
    console.error("Error adding array field:", error);
  }
}



/**
 * Adds a file to the database
 * @async
 * @function
 * @param {string} courseID - The course ID 
 */
async function submitFile(courseID) {
  // Get the file input element
  var fileInput = document.getElementById('formFileLg');
  var nameInput = document.getElementById('fileName').value;
  var desc = document.getElementById('fileDesc').value;

  // Get the selected file
  var file = fileInput.files[0];

  // Get the selected value from the dropdown
  var selectElement = document.getElementById('inputGroupSelect04');
  var selectedValue = selectElement.value;

  console.log(file.name);
  if (selectedValue == 1) {
    uploadFile(courseID, "Lectures", file.name, desc, file);
  } else if (selectedValue == 2) {
    uploadFile(courseID, "Videos", file.name, desc, file);
  } else if (selectedValue == 3) {
    uploadFile(courseID, "Quiz", file.name, desc, file);
  } else if (selectedValue == 4) {
    uploadFile(courseID, "Exams", file.name, desc, file);
  }
}


window.submitFile = submitFile;
window.generateUpload = generateUpload;
window.generateCourseVideos = generateCourseVideos;
window.generateCourseLectures = generateCourseLectures;
window.generateCourseExams = generateCourseExams;
window.generateCourseNavigation = generateCourseNavigation;




