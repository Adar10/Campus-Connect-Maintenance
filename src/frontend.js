import { getDoc, doc } from 'firebase/firestore';
import { getCourses, getFileDownloadURL, getDB } from './backend.js'

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

  const docRef = doc(db, courseID, "Tentor");
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

  const docRef = doc(getDB(), courseID, "Lectures");
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

// Expose generateCourseLectures function globally for usage
window.generateCourseLectures = generateCourseLectures;

// Expose generateCourseExams function globally for usage
window.generateCourseExams = generateCourseExams;

// Expode generateCourseNavigation function globally for usage
window.generateCourseNavigation = generateCourseNavigation;




