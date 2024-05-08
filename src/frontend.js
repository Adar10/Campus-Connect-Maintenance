import { getDoc, doc, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import { getCourses, getFileDownloadURL, db, storage } from './backend.js'
import { ref, uploadBytes } from 'firebase/storage';

/**
 * Asynchronously generates navigation elements for available courses and appends them to the designated navigation element in the DOM.
 * This function retrieves a list of courses from `getCourses`, then iterates through each course to dynamically create a navigational button.
 * Each button includes an anchor link that, when clicked, stores course information in localStorage and navigates to a `lectures.html` page with related content.
 * @async
 * @function generateCourseNavigation
 * @returns {Promise<void>} Does not explicitly return a value; results in side effects in the DOM and localStorage.
 */
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
      console.log(course.ID);
    });
    link.style.textDecoration = "none";
    link.style.color = "black";

    const h5 = document.createElement("h5");

    const button = document.createElement("button");
    button.classList.add("btn", "btn-info", "btn-lg");
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

/**
 * Asynchronously generates and displays cards for each exam associated with a course retrieved from Firestore.
 * The function fetches the course ID from localStorage, uses it to construct a Firestore document reference, and retrieves the document.
 * If the document exists and contains data, it processes each field in the document (expected to be an exam-related data array),
 * creates a card for each exam, and attaches an event listener to a button on the card that attempts to open a file URL when clicked.
 * 
 * @async
 * @function generateCourseExams
 * @returns {Promise<void>} Executes asynchronous operations and manipulates the DOM, but returns no value.
 */
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
        card_container.classList.add("card", "container", "mt-5", "border", "border-dark");
        card_container.style.width = "20rem";


        const card_body = document.createElement("div");
        card_body.classList.add("card-body");


        const name = document.createElement("h5");
        name.textContent = arrayField[0];

        const button = document.createElement("button");
        button.textContent = "Click to open";
        button.classList.add("btn", "btn-info", "btn-lg");
        button.addEventListener('click', async () => {
          try {
            const URL = await getFileDownloadURL(arrayField[1]);
            window.open(URL);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        });

        const heart = document.createElement("p");
        heart.classList.add("btn", "shadow-none");
        heart.textContent = "🖤" + arrayField[3];
        heart.style.fontSize = "2rem";

        heart.addEventListener('click', async () => {
          try {
            const count = await getLikeCount("Exams", arrayField[0]);
            if (heart.textContent == "🖤" + count) {

              await addArrayFieldToDocument(courseID, "Exams", arrayField[0], arrayField[1], arrayField[2], count + 1);
              heart.textContent = "❤" + await getLikeCount("Exams", arrayField[0]);

            }
            else {
              await addArrayFieldToDocument(courseID, "Exams", arrayField[0], arrayField[1], arrayField[2], count - 1);
              heart.textContent = "🖤" + await getLikeCount("Exams", arrayField[0]);
            }
          } catch (error) {
            console.error("error", error);
          }
        });

        card_body.appendChild(name);
        card_body.appendChild(button);
        card_body.appendChild(heart);
        card_container.appendChild(card_body);
        row.appendChild(card_container);


      }
    }
  } else {
    console.log("No such document!");
  }

}

/**
 * Asynchronously generates exam cards for a specific course and appends them to a specified element in the DOM.
 * This function retrieves a course ID from localStorage, then uses it to fetch exam data from a Firestore collection.
 * Each exam entry is displayed in a card with a clickable button that, when clicked, attempts to open a document or file related to the exam.
 * 
 * @async
 * @function generateCourseExams
 * @returns {Promise<void>} Does not return a value but performs DOM manipulations and might open new browser tabs based on user interaction.
 */

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
        card_container.classList.add("card", "container", "mt-5", "border", "border-dark");
        card_container.style.width = "20rem";


        const card_body = document.createElement("div");
        card_body.classList.add("card-body");


        const name = document.createElement("h5");
        name.textContent = arrayField[0];

        const desc = document.createElement("p");
        desc.textContent = arrayField[2];

        const button = document.createElement("button");
        button.textContent = "Click to open";
        button.classList.add("btn", "btn-info", "btn-lg");
        button.addEventListener('click', async () => {
          try {
            const URL = await getFileDownloadURL(arrayField[1]);
            window.open(URL);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        });


        const heart = document.createElement("p");
        heart.classList.add("btn", "shadow-none");
        heart.textContent = "🖤" + arrayField[3];
        heart.style.fontSize = "2rem";

        heart.addEventListener('click', async () => {
          try {
            const count = await getLikeCount("Lectures", arrayField[0]);
            if (heart.textContent == "🖤" + count) {

              await addArrayFieldToDocument(courseID, "Lectures", arrayField[0], arrayField[1], arrayField[2], count + 1);
              heart.textContent = "❤" + await getLikeCount("Lectures", arrayField[0]);

            }
            else {
              await addArrayFieldToDocument(courseID, "Lectures", arrayField[0], arrayField[1], arrayField[2], count - 1);
              heart.textContent = "🖤" + await getLikeCount("Lectures", arrayField[0]);
            }
          } catch (error) {
            console.error("error", error);
          }
        });

        card_body.appendChild(name);
        card_body.appendChild(desc);
        card_body.appendChild(button);
        card_body.appendChild(heart);
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
    const data = docSnap.data().videos;
    if (data) {
      // Iterate over each field in the document's data
      data.forEach((video) => {

        console.log(video);

        const iframe = document.createElement("iframe");
        iframe.width = "400px"
        iframe.height = "315px"
        iframe.src = video;
        iframe.title = "hejsan";
        iframe.frameborder = "0"
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.setAttribute('allowFullScreen', '');
        iframe.style.margin = "3rem";



        row.appendChild(iframe);

      })
    }
  } else {
    console.log("No such document!");
  }
}

/**
* Uploads a file and creates a firestore reference.
* @async
* @function
* @param {string} document - The course document to enter
* @param {string} name - Name of the wanted field 
*/
async function getLikeCount(document, name) {

  var courseID = localStorage.getItem("ID");
  console.log(courseID);

  const docRef = doc(db, courseID, document);
  const docSnap = await getDoc(docRef);
  console.log(docSnap);

  if (docSnap) {
    const data = docSnap.data();
    if (data) {
      // Iterate over each field in the document's data
      for (const fieldName in data) {

        if (fieldName == name) {
          const arrayField = data[fieldName];
          console.log(arrayField[0]);
          console.log(arrayField[3]);
          return arrayField[3];
        }
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
    file.style.visibility = "hidden";

    const fileName = document.createElement("input");
    fileName.classList.add("form-control");
    fileName.id = "fileName";
    fileName.type = "text";
    fileName.placeholder = "Name of file";
    fileName.style.visibility = "hidden";


    const fileDesc = document.createElement("input");
    fileDesc.classList.add("form-control");
    fileDesc.id = "fileDesc";
    fileDesc.type = "text"
    fileDesc.placeholder = "Description of file";
    fileDesc.style.visibility = "hidden";


    const videoUrl = document.createElement("input");
    videoUrl.classList.add("form-control");
    videoUrl.id = "videoUrl";
    videoUrl.type = "text";
    videoUrl.placeholder = "Embedded video link"
    videoUrl.style.visibility = "hidden";


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
    opt_3.textContent = "Exams";

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

    select.addEventListener('change', (event) => selectFunction(event, file, videoUrl, fileName, fileDesc));




    div_start.appendChild(card_container);
    card_container.appendChild(card_body);
    card_body.appendChild(name);
    card_body.appendChild(file);
    card_body.appendChild(fileName);
    card_body.appendChild(fileDesc);
    card_body.appendChild(videoUrl);
    card_body.appendChild(div_input);
    div_input.appendChild(select);
    select.appendChild(opt_type);
    select.appendChild(opt_1);
    select.appendChild(opt_2);
    select.appendChild(opt_3);
    div_input.appendChild(btn);

    console.log("upload loaded successfully");

  });
}

async function selectFunction(event, file, videUrl, name, desc) {
  const select = event.target;
  const option = select.value;

  if (option == 2) {

    videUrl.style.visibility = "visible";

    file.style.visibility = "hidden";
    name.style.visibility = "hidden";
    desc.style.visibility = "hidden";
  }
  else if (option == 1 || option == 3) {
    videUrl.style.visibility = "hidden";

    file.style.visibility = "visible";
    name.style.visibility = "visible";
    desc.style.visibility = "visible";
  }
  else {
    videUrl.style.visibility = "hidden";
    file.style.visibility = "hidden";
    name.style.visibility = "hidden";
    desc.style.visibility = "hidden";
  }
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
    addArrayFieldToDocument(collectionID, category, fileName, `${collectionID}/${category}/${fileName}`, desc, 0);
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded file succesfully");
      document.getElementById("alert").style.display = "block";
      setTimeout(function () {
        document.getElementById("alert").style.display = "none";
      }, 2000);
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

async function uploadVideos(collectionID, category, URL) {
  try {
    const docRef = doc(db, collectionID, "Videos");
    const snapshot = await getDoc(docRef);
    var array = snapshot.data().videos;
    console.log(array[0]);
    await updateDoc(docRef, {
      videos: arrayUnion(URL)
    });
    console.log("Video uploaded");
    document.getElementById("alert").style.display = "block";
    setTimeout(function () {
      document.getElementById("alert").style.display = "none";
    }, 2000);
  } catch (error) {
    console.error("Error uploading video", error);
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
 * @param {string} fieldValue4 - Array index 3 value.
 */
async function addArrayFieldToDocument(collectionID, documentName, fieldValue1, fieldValue2, fieldValue3, fieldValue4) {
  try {
    const docRef = doc(db, collectionID, documentName);
    await setDoc(docRef, {
      [fieldValue1]: [fieldValue1, fieldValue2, fieldValue3, fieldValue4]
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
  var videoUrl = document.getElementById("videoUrl").value;

  // Get the selected file
  var file = fileInput.files[0];

  // Get the selected value from the dropdown
  var selectElement = document.getElementById('inputGroupSelect04');
  var selectedValue = selectElement.value;

  if (selectedValue == 1) {
    uploadFile(courseID, "Lectures", file.name, desc, file);
  } else if (selectedValue == 2) {
    uploadVideos(courseID, "Videos", videoUrl);
  } else if (selectedValue == 3) {
    uploadFile(courseID, "Exams", file.name, desc, file);
  }
}

// Expose submitFile function globally for usage
window.submitFile = submitFile;

// Expose generateUpload function globally for usage
window.generateUpload = generateUpload;

// Expose generateCourseVideos function globally for usage
window.generateCourseVideos = generateCourseVideos;

// Expose generateCourseLectures function globally for usage
window.generateCourseLectures = generateCourseLectures;

// Expose generateCourseExams function globally for usage
window.generateCourseExams = generateCourseExams;

// Expode generateCourseNavigation function globally for usage
window.generateCourseNavigation = generateCourseNavigation;




