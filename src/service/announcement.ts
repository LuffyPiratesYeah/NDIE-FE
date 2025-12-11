import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getAnnouncement() {
  try {
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