import { initializeApp } from "firebase/app";  
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc, count, getDoc } from "firebase/firestore";

import { getDB } from './backend.js';
 

// DOM elements

const questionElem = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons"); 
const nextButton = document.getElementById("next-btn"); 

const db = getDB();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function fetchQuiz() {
    var allquizzes = [];

    var courseID = localStorage.getItem("ID");
    console.log(courseID);
  
    // Access document Quizzes
    const docRef = doc(db, courseID, "Quizzes");
    

    // Access collection all-quizzes
    const docSnap = collection(docRef ,"all-quizzes");
    console.log(docSnap);

    if (docSnap) {
        await getDocs(docSnap).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Access the fields
                const questionsData = doc.data().questions;
                const subject = doc.data().subject;
                let docQuestions = [];
    
                // Process each question
                if (questionsData) {
                    questionsData.forEach((questionItem) => {
                        const correctAnswer = questionItem.correctAnswer;
                        const wrongAnswersMap = questionItem.incorrectAnswers;
                        const questionText = questionItem.question;
    
                        // Convert the wrongAnswers map into an array
                        const wrongAnswersArray = Object.values(wrongAnswersMap);
    
                        // Combine correct and wrong answers and shuffle them
                        var allAnswers = [correctAnswer, ...wrongAnswersArray];
                        shuffleArray(allAnswers);
    
                        // Push each question into the questions array
                        docQuestions.push({
                            question: questionText,
                            answers: allAnswers,
                            correctAnswer: correctAnswer
                        });
                    });
                }
            
                allquizzes.push(docQuestions);
            });

            
        });
        
        
    }
    return allquizzes;
    
}

  
  // Variables to track quiz progress and score
  let currentQuestionIndex = 0; 
  let questionNumber = 1;
  let score = 0; 
  //Global variable for all elements in quiz
  let questions = [];
  
  // Start the quiz with the given questions array
  async function startQuiz() {
    let questionsArray = [];
    questionsArray = await fetchQuiz();
    console.log(questionsArray);
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";

    for (let i = 0; i < questionsArray.length; i++) {
        questions = questionsArray[i];
        showQuestion(questionsArray[i]);
            
        await new Promise(resolve => {
            nextButton.onclick = resolve;
        });
    }
    
  }
  
  // Function to display the current question
  function showQuestion(arr){
    resetState();
    let currentQuestions = arr; 
    let questionNo = questionNumber++; 
    questionElem.innerHTML = questionNo + ". " + currentQuestions[currentQuestionIndex].question; 
    
    // Loop through each answer and create buttons for them
    currentQuestions[currentQuestionIndex].answers.forEach(answer => {
        const button = document.createElement("button"); 
        button.innerHTML = answer;
        button.classList.add("btn"); 
        answerButtons.appendChild(button); 
        if(answer === currentQuestions[currentQuestionIndex].correctAnswer){
            button.dataset.correct = true; 
        }
        button.addEventListener("click", selectAnswer)
    }); 
}

  
  // Function to reset the quiz state
  function resetState(){
    nextButton.style.display = "none"; 
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
  }
  
  // Function to handle user's answer selection
  function selectAnswer(e){
    const selectedBtn = e.target; 
    const isCorrect = selectedBtn.innerHTML === questions[currentQuestionIndex].correctAnswer; 
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;  
    }else{
        selectedBtn.classList.add("incorrect"); 
    }
    // Disable all buttons after selection
    Array.from(answerButtons.children).forEach(button => {
        if(button.innerHTML === questions[currentQuestionIndex].correctAnswer){
            button.classList.add("correct"); 
        }
        button.disabled = true; 
    }); 
    nextButton.style.display = "block"; 
}

  
  // Function to display the final score
  function showScore(){
    resetState(); 
    questionElem.innerHTML = `You scored ${score} out of ${questions.length}!`; 
    nextButton.innerHTML = "Play Again"; 
    nextButton.style.display = "block";
  }
  
  // Event listener for the "Next" button
  function handleNextButton(){
    currentQuestionIndex++
    if(currentQuestionIndex < questions.length){
        showQuestion()
    }else{
        showScore(); 
    }
  }
  


window.fetchQuiz = fetchQuiz;
window.startQuiz = startQuiz;