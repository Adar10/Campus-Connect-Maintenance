// Tests for the sign-in handler in src/backend.js 

import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getCurrentUser } from '../src/backend.js';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));


const signInHandler = onAuthStateChanged.mock.calls[0][1];

// doc() gives the path as text, for example "users/user1"
doc.mockImplementation((db, ...parts) => parts.join('/'));
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('sign-in handler', () => {
  test('somebody signs in (path 1-2)', async () => {
    document.body.innerHTML = '<h1 id="displayName"></h1>';

    await signInHandler({ uid: 'user1', email: 'student@example.com', displayName: 'Sam' });

    expect(await getCurrentUser()).toEqual({ uid: 'user1', umail: 'student@example.com' });
    expect(setDoc).toHaveBeenCalledWith('users/user1', { email: 'student@example.com' }, { merge: true });
    expect(document.getElementById('displayName').textContent).toBe('Sam');
  });

  test('somebody signs out (path 1-3)', async () => {
    await signInHandler(null);

    expect(await getCurrentUser()).toBeNull();
  });
});
