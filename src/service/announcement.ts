import { getFirebaseDb } from "@/lib/firebase";

export async function getAnnouncement() {
  try {
    const db = await getFirebaseDb();
    if (!db) return [];
    
    const { collection, getDocs } = await import("firebase/firestore");
    const querySnapshot = await getDocs(collection(db, "announcement"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any[];
  } catch (error) {
    console.error(error);
    return [];
  }
}