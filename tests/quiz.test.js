// Tests for createQuiz, fetchQuiz, startQuiz and selectAnswer in src/quiz.js.

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  collection: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
}));
jest.mock('../src/backend.js', () => ({
  db: 'db',
  getCurrentUser: jest.fn(),
}));

// quiz.js looks up these elements when it is loaded, so the page is built first
document.body.innerHTML = `
  <h2 id="question"></h2>
  <div id="answer-buttons"></div>
  <button id="next-btn"></button>
  <input id="quiz-name">
  <div id="error-message"></div>`;
// quiz.js uses jQuery to show and hide elements. The tests do not need that
window.$ = () => ({ show: () => {}, hide: () => {} });

const { doc, getDoc, getDocs, setDoc } = require('firebase/firestore');
const { getCurrentUser } = require('../src/backend.js');
const { createQuiz, fetchQuiz, startQuiz } = require('../src/quiz.js');

const question = { question: 'What is 2 + 2?', correctAnswer: '4', incorrectAnswers: ['3', '5', '22'] };

const wait = () => new Promise((resolve) => setTimeout(resolve, 0));

function questionText() {
  return document.getElementById('question').textContent;
}

function answerButton(text) {
  const buttons = Array.from(document.getElementById('answer-buttons').children);
  return buttons.find((button) => button.textContent === text);
}

function clickNext() {
  document.getElementById('next-btn').click();
}

// makes the fake database answer with a quiz that has these questions
function quizHas(questions) {
  getDoc.mockResolvedValue({ data: () => ({ questions: questions }) });
}

beforeEach(() => {
  jest.resetAllMocks();
  doc.mockImplementation((db, ...parts) => parts.join('/'));
  getCurrentUser.mockResolvedValue({ uid: 'user1' });
  localStorage.setItem('ID', 'COURSE');
  document.getElementById('quiz-name').value = 'Quiz 1';
  document.getElementById('error-message').textContent = '';
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('createQuiz', () => {
  const newQuiz = { questions: [], likes: 0 };

  test('the course has no quizzes (path 1-4-6)', async () => {
    getDocs.mockResolvedValue([]);

    await createQuiz();

    expect(setDoc).toHaveBeenCalledWith('COURSE/Quizzes/all-quizzes/Quiz 1', newQuiz);
  });

  test('the name is taken (path 1-2-3-1-4-5)', async () => {
    getDocs.mockResolvedValue([{ id: 'Quiz 1' }]);

    await createQuiz();

    expect(setDoc).not.toHaveBeenCalled();
    expect(document.getElementById('error-message').textContent).toBe(
      'A quiz with this name already exists. Please choose another name.',
    );
  });

  test('the course only has quizzes with other names (path 1-2-1-4-6)', async () => {
    getDocs.mockResolvedValue([{ id: 'Another quiz' }]);

    await createQuiz();

    expect(setDoc).toHaveBeenCalledWith('COURSE/Quizzes/all-quizzes/Quiz 1', newQuiz);
  });
});

describe('fetchQuiz', () => {
  test('the quiz has no list of questions (path 1-4)', async () => {
    getDoc.mockResolvedValue({ data: () => ({}) });

    const questions = await fetchQuiz('Quiz 1');

    expect(questions).toEqual([]);
  });

  test('the list of questions is empty (path 1-2-4)', async () => {
    quizHas([]);

    const questions = await fetchQuiz('Quiz 1');

    expect(questions).toEqual([]);
  });

  test('the quiz has a question (path 1-2-3-2-4)', async () => {
    quizHas([question]);

    const questions = await fetchQuiz('Quiz 1');

    expect(questions).toHaveLength(1);
    expect(questions[0].question).toBe('What is 2 + 2?');
    expect(questions[0].correctAnswer).toBe('4');
    expect(questions[0].answers.sort()).toEqual(['22', '3', '4', '5']);
  });
});

describe('startQuiz', () => {
  test('the quiz has no questions (path 1-3)', async () => {
    quizHas([]);

    await startQuiz('Quiz 1');

    expect(questionText()).toBe('You scored 0 out of 0!');
  });

  test('the quiz has a question (path 1-2-1-3)', async () => {
    quizHas([question]);

    const quizIsFinished = startQuiz('Quiz 1');
    await wait();
    expect(questionText()).toBe('1. What is 2 + 2?');

    clickNext();
    await quizIsFinished;
    expect(questionText()).toBe('You scored 0 out of 1!');
  });
});

// selectAnswer runs when an answer button is clicked.
describe('selectAnswer', () => {
  test('the right answer is clicked (path 1-2-4-...-8)', async () => {
    quizHas([question]);
    const quizIsFinished = startQuiz('Quiz 1');
    await wait();

    answerButton('4').click();

    expect(answerButton('4').classList.contains('correct')).toBe(true);
    clickNext();
    await quizIsFinished;
    expect(questionText()).toBe('You scored 1 out of 1!');
  });

  test('a wrong answer is clicked (path 1-3-4-...-8)', async () => {
    quizHas([question]);
    const quizIsFinished = startQuiz('Quiz 1');
    await wait();

    answerButton('5').click();

    expect(answerButton('5').classList.contains('incorrect')).toBe(true);
    expect(answerButton('4').classList.contains('correct')).toBe(true);
    clickNext();
    await quizIsFinished;
    expect(questionText()).toBe('You scored 0 out of 1!');
  });
});
