import React, { useContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  setDoc,
  Timestamp,
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const auth = getAuth();
  async function signup(email, password) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (user) {
        await createUser(user.uid, email);
      }
    } catch (err) {
      return err.message;
    }
    return "success";
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password).then((user) => {
        setCurrentUser(user);
      });
    } catch (err) {
      return err.message;
    }
    return "success";
  }

  function logout() {
    try {
      signOut(auth);
    } catch (err) {
      setAuthError(err);
    }
  }

  async function saveTranscript(uid, chatId, transcript) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          transcript: transcript,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving transcript to Firestore: ", error);
    }
  }

  async function saveTranscriptSummary(uid, chatId, summary) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          transcriptSummary: summary,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving transcript to Firestore: ", error);
    }
  }

  async function saveItemName(uid, chatId, name) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          name: name,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving Item Name to Firestore: ", error);
    }
  }

  async function moveToTrash(uid, chatId) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          status: "Deleted",
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error moving item to trash in Firestore: ", error);
    }
  }

  async function moveToLive(uid, chatId) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          status: "Live",
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error moving item to trash in Firestore: ", error);
    }
  }

  async function saveChat(uid, chatId, conversation) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          messages: conversation,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving conversation to Firestore: ", error);
    }
  }

  async function saveFolderIsOpen(uid, chatId, isOpen) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          isOpen: isOpen,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving conversation to Firestore: ", error);
    }
  }

  async function removeCredits(uid, amount) {
    try {
      const userDocRef = doc(db, "users", uid);

      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        console.error("User does not exist!");
        return;
      }
      const currentCredits = userDocSnap.data().credits || 0;

      const newCredits = currentCredits - amount;

      await setDoc(
        doc(db, "users", uid),
        {
          credits: newCredits,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating credits in Firestore: ", error);
    }
  }

  async function setItemParent(uid, chatId, parentId) {
    try {
      await setDoc(
        doc(db, "users", uid, "foldersAndChats", chatId),
        {
          parentId: parentId,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving conversation to Firestore: ", error);
    }
  }
  async function getUser(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    return docSnap.data();
  }

  async function getChat(uid, chatId) {
    const docRef = doc(db, "users", uid, "foldersAndChats", chatId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    return docSnap.data();
  }
  async function getSidebarInfo(uid) {
    const q = query(collection(db, "users", uid, "foldersAndChats"));

    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  async function createFoldersAndChats(
    uid,
    name,
    type,
    itemId,
    parentId = null
  ) {
    const docData = {
      userId: String(uid),
      name: name,
      type: type,
      createdDate: Timestamp.fromDate(new Date()),
      parentId: parentId,
      itemId: String(itemId),
      status: "Live",
      isOpen: true,
    };
    try {
      const docRef = await setDoc(
        doc(db, "users", uid, "foldersAndChats", String(itemId)),
        docData
      );
    } catch (e) {
      console.error(uid, " ", itemId);
      console.error(e);
    }
  }
  async function createUser(uid, email) {
    const docData = {
      userId: String(uid),
      createdDate: Timestamp.fromDate(new Date()),
      credits: 50,
      email: email,
    };
    try {
      const docRef = await setDoc(doc(db, "users", String(uid)), docData);
    } catch (e) {
      console.error(e);
    }
  }
  function readUser(uid) {}

  function readChat(uid, chatId, folderId) {}

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      return err.message;
    }
    return "success";
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    loading,
    authError,
    signup,
    login,
    logout,
    resetPassword,
    createUser,
    createFoldersAndChats,
    saveChat,
    saveTranscript,
    getChat,
    getSidebarInfo,
    setItemParent,
    moveToTrash,
    moveToLive,
    saveItemName,
    saveTranscriptSummary,
    removeCredits,
    getUser,
    saveFolderIsOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
