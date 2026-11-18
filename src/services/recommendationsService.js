import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'recommendations';

export const fetchUserRecommendations = async (uid) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('uid', '==', uid)
  );
  const querySnapshot = await getDocs(q);
  const items = querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
  // Ordenamos del más reciente al más antiguo en el cliente
  return items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const createRecommendation = async (uid, data) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    uid,
    title: data.title.trim(),
    category: data.category,
    recommendedBy: data.recommendedBy.trim(),
    reason: data.reason.trim(),
    status: 'Pendiente',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const toggleRecommendationStatus = async (id, currentStatus) => {
  const nextStatus = currentStatus === 'Pendiente' ? 'Finalizado' : 'Pendiente';
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status: nextStatus });
  return nextStatus;
};

export const removeRecommendation = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};