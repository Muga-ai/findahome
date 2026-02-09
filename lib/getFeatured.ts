import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export async function getFeaturedListings() {
  try {
    const q = query(
      collection(db, "listings"),
      where("featured", "==", true),
      limit(10)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }
}
