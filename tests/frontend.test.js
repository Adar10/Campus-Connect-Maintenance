// Tests for submitFile, deleteVideo and deleteContent in src/frontend.js.

import { doc, getDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { getCurrentUser } from '../src/backend.js';
import { submitFile, deleteVideo, deleteContent } from '../src/frontend.js';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  deleteField: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
}));
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  deleteObject: jest.fn(),
  getDownloadURL: jest.fn(),
}));
jest.mock('../src/backend.js', () => ({
  db: 'db',
  storage: 'storage',
  getCurrentUser: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  doc.mockImplementation((db, ...parts) => parts.join('/'));
  ref.mockImplementation((storage, path) => path);
  getCurrentUser.mockResolvedValue({ uid: 'user1' });
  jest.spyOn(window, 'setTimeout').mockImplementation((callback) => callback());
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('submitFile', () => {
  const LECTURES = '1';
  const VIDEOS = '2';
  const EXAMS = '3';
  const NO_TYPE = '0';
  const fileNotFound = { code: 'storage/object-not-found' };
  const noPermission = { code: 'storage/unauthorized' };
  const noFile = undefined; 

  // builds the upload form with the type and the name that the user has filled in
  function fillInForm(type, name) {
    document.body.innerHTML = `
      <div id="alert"></div>
      <input id="formFileLg0" type="file">
      <input id="fileName0" value="${name}">
      <input id="fileDesc0" value="">
      <input id="videoUrl0" value="${name}">
      <select id="inputGroupSelect040">
        <option value="0">Choose data type</option>
        <option value="1">Lectures</option>
        <option value="2">Videos</option>
        <option value="3">Exams</option>
      </select>`;
    document.getElementById('inputGroupSelect040').value = type;
  }

  test('lecture with a free name (path 1-2-3-5-6-2-8)', async () => {
    fillInForm(LECTURES, 'notes');
    getDownloadURL.mockRejectedValue(fileNotFound);

    await submitFile('COURSE', 0);

    expect(uploadBytes).toHaveBeenCalledWith('COURSE/Lectures/notes', noFile);
  });

  test('lecture with a name that is taken (path 1-2-3-4-2-3-5-6-2-8)', async () => {
    fillInForm(LECTURES, 'notes');
    getDownloadURL.mockResolvedValueOnce('link to the old file');
    getDownloadURL.mockRejectedValue(fileNotFound);

    await submitFile('COURSE', 0);

    expect(uploadBytes).toHaveBeenCalledWith('COURSE/Lectures/notes(2)', noFile);
  });

  test('lecture when storage gives an error (path 1-2-3-5-7)', async () => {
    fillInForm(LECTURES, 'notes');
    getDownloadURL.mockRejectedValue(noPermission);

    await expect(submitFile('COURSE', 0)).rejects.toEqual(noPermission);

    expect(uploadBytes).not.toHaveBeenCalled();
  });

  test('video link (path 1-9-10)', async () => {
    fillInForm(VIDEOS, 'https://www.youtube.com/embed/abc');
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ videos: [] }) });

    await submitFile('COURSE', 0);

    expect(arrayUnion).toHaveBeenCalledWith('https://www.youtube.com/embed/abc');
    expect(uploadBytes).not.toHaveBeenCalled();
  });

  test('exam with a free name (path 1-9-11-12-13-15-16-12-18)', async () => {
    fillInForm(EXAMS, 'exam2024');
    getDownloadURL.mockRejectedValue(fileNotFound);

    await submitFile('COURSE', 0);

    expect(uploadBytes).toHaveBeenCalledWith('COURSE/Exams/exam2024', noFile);
  });

  test('exam with a name that is taken (path 1-9-11-12-13-14-12-13-15-16-12-18)', async () => {
    fillInForm(EXAMS, 'exam2024');
    getDownloadURL.mockResolvedValueOnce('link to the old file');
    getDownloadURL.mockRejectedValue(fileNotFound);

    await submitFile('COURSE', 0);

    expect(uploadBytes).toHaveBeenCalledWith('COURSE/Exams/exam2024(2)', noFile);
  });

  test('exam when storage gives an error (path 1-9-11-12-13-15-17)', async () => {
    fillInForm(EXAMS, 'exam2024');
    getDownloadURL.mockRejectedValue(noPermission);

    await expect(submitFile('COURSE', 0)).rejects.toEqual(noPermission);

    expect(uploadBytes).not.toHaveBeenCalled();
  });

  test('no type chosen (path 1-9-11)', async () => {
    fillInForm(NO_TYPE, 'notes');

    await submitFile('COURSE', 0);

    expect(uploadBytes).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });
});

describe('deleteVideo', () => {
  const first = 'https://www.youtube.com/embed/aaa';
  const second = 'https://www.youtube.com/embed/bbb';

  test('the video is first in the list (path 1-2-3)', async () => {
    getDoc.mockResolvedValue({ data: () => ({ videos: [first, second] }) });

    await deleteVideo('COURSE', 'Videos', 'COURSE/Videos/' + first);

    expect(arrayRemove).toHaveBeenCalledWith(first);
  });

  test('the video is second in the list (path 1-2-4-1-2-3)', async () => {
    getDoc.mockResolvedValue({ data: () => ({ videos: [first, second] }) });

    await deleteVideo('COURSE', 'Videos', 'COURSE/Videos/' + second);

    expect(arrayRemove).toHaveBeenCalledWith(second);
  });

  test('the video is not in the list (path 1-2-4-1)', async () => {
    getDoc.mockResolvedValue({ data: () => ({ videos: [first] }) });

    await deleteVideo('COURSE', 'Videos', 'COURSE/Videos/' + second);

    expect(updateDoc).not.toHaveBeenCalled();
  });
});

describe('deleteContent', () => {
  const video = 'https://www.youtube.com/embed/aaa';

  beforeEach(() => {
    getDoc.mockResolvedValue({ data: () => ({ videos: [video], files: {} }) });
  });

  test('a quiz (path 1-2-6)', async () => {
    await deleteContent('Quiz 1', 'COURSE/Quizzes/all-quizzes/Quiz 1');

    expect(deleteDoc).toHaveBeenCalledWith('COURSE/Quizzes/all-quizzes/Quiz 1');
    expect(updateDoc).toHaveBeenCalledWith('users/user1', { files: {} });
  });

  test('a video (path 1-3-4-6)', async () => {
    await deleteContent(video, 'COURSE/Videos/' + video);

    expect(arrayRemove).toHaveBeenCalledWith(video);
    expect(updateDoc).toHaveBeenCalledWith('users/user1', { files: {} });
  });

  test('a lecture or an exam (path 1-3-5-6)', async () => {
    await deleteContent('COURSE/Lectures/notes', 'COURSE/Lectures/notes');

    expect(deleteObject).toHaveBeenCalledWith('COURSE/Lectures/notes');
    expect(updateDoc).toHaveBeenCalledWith('users/user1', { files: {} });
  });
});
