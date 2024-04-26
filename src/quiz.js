import { initializeApp } from "firebase/app";  
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc, count, getDoc, arrayUnion } from "firebase/firestore";

import { getDB } from './backend.js';
 

// DOM elements

//TODO: Documentation

const questionElem = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons"); 
const nextButton = document.getElementById("next-btn"); 

const db = getDB();

async function createQuiz() {
    var courseID = localStorage.getItem("ID");

    var quizName = document.getElementById("quiz-name").value;

    const docRef = doc(db, courseID, "Quizzes");
    
    const docSnap = collection(docRef, "all-quizzes");

    const docs = await getDocs(docSnap);

    let quizExists = false;
    docs.forEach((doc) => {
        if (doc.id === quizName) {
        quizExists = true;
        }
    });
        if (quizExists) {
            //TODO: Fixa error handling
            console.log("A quiz with this name already exists. Please choose another name.");
        } else {
            const quizDocRef = doc(db, courseID, 'Quizzes', 'all-quizzes', quizName); 

            await setDoc(quizDocRef, {
                questions: []
            });
            console.log("Document successfully created");
        }
}


async function addQuizQuestions() {
    var courseID = localStorage.getItem("ID");
    var quizName = document.getElementById("quiz-name").value;
    const quizDocRef = doc(db, courseID, 'Quizzes', 'all-quizzes', quizName); 

   
    var questionInputs = $('.question-inputs');

    questionInputs.each(async function() {
        var inputQuestion = $(this).find('.question').val();
        var correctAns = $(this).find('.correct-answer').val();
        var incorrectAnswer1 = $(this).find('.incorrect-answer1').val();
        var incorrectAnswer2 = $(this).find('.incorrect-answer2').val();
        var incorrectAnswer3 = $(this).find('.incorrect-answer3').val();

        var newQuestion = {
            correctAnswer: correctAns,
            incorrectAnswers: [incorrectAnswer1, incorrectAnswer2, incorrectAnswer3],
            question: inputQuestion
        };

        await updateDoc(quizDocRef, {
            questions: arrayUnion(newQuestion)
        });

        // Clear question inputs
        $(this).find('input').val('');
    });

    console.log("Document updated")
}



function getAllQuizzes() {
    var courseID = localStorage.getItem("ID");
    console.log(courseID);

    //TODO: Hitta bättre sätt att komma åt subcollection
    const docRef = doc(db, courseID, "Quizzes");

    const docSnap = collection(docRef ,"all-quizzes");

    getDocs(docSnap).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const quizID = doc.id; 
            const button = document.createElement("button"); 
            button.innerHTML = quizID; 
            button.classList.add("btn"); 
            
            button.addEventListener("click", function() {
                
                localStorage.setItem("selectedQuizID", quizID);
                
                window.location.href = "quiz.html";
            });
            
            document.getElementById('quizzes').appendChild(button);
        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function fetchQuiz(quizID) {

    var courseID = localStorage.getItem("ID");
    console.log(courseID);
  
    const docRef = doc(db, courseID, "Quizzes");
    
    const docSnap = collection(docRef ,"all-quizzes");
    console.log(docSnap);

    const quizDocRef = doc(docSnap, quizID);
    const quizDocSnap = await getDoc(quizDocRef);

    
    const questionsData = quizDocSnap.data().questions;
    let docQuestions = [];
    
            
    if (questionsData) {
        questionsData.forEach((questionItem) => {
        const correctAnswer = questionItem.correctAnswer;
        const wrongAnswersMap = questionItem.incorrectAnswers;
        const questionText = questionItem.question;
    
        const wrongAnswersArray = Object.values(wrongAnswersMap);
    
        var allAnswers = [correctAnswer, ...wrongAnswersArray];
        shuffleArray(allAnswers);
    
        docQuestions.push({
            question: questionText,
            answers: allAnswers,
            correctAnswer: correctAnswer
            });
        
        });
        console.log(docQuestions);
    }
       
    return docQuestions;            
}

  
  let currentQuestionIndex = 0; 
  let questionNumber = 1;
  let score = 0; 
  let questions = [];
  
  async function startQuiz(quizID) {
    
    let quizQuestion = await fetchQuiz(quizID);
    
    console.log(quizQuestion);
    console.log("here");
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";

    for (let i = 0; i < quizQuestion.length; i++) {
        
        
        questions = quizQuestion[i];
        console.log(questions);
        
        showQuestion(quizQuestion[i]);
            
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
    questionElem.innerHTML = questionNo + ". " + currentQuestions.question; 
    console.log(currentQuestions.question)
 
    console.log("here");
    
    currentQuestions.answers.forEach(answer => {
        const button = document.createElement("button"); 
        button.innerHTML = answer;
        button.classList.add("btn"); 
        answerButtons.appendChild(button); 
        if(answer === currentQuestions.correctAnswer){
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
    console.log("here");
    console.log(questions);
    console.log("here")
    
    const isCorrect = selectedBtn.innerHTML === questions.correctAnswer; 
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;  
    }else{
        selectedBtn.classList.add("incorrect"); 
    }
    // Disable all buttons after selection
    Array.from(answerButtons.children).forEach(button => {
        if(button.innerHTML === questions.correctAnswer){
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
window.getAllQuizzes = getAllQuizzes;
window.createQuiz = createQuiz;
window.addQuizQuestions = addQuizQuestions;