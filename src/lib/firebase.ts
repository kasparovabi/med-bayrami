// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZs6FwcFtswfqpVL56988kTjMhXxyY6pE",
    authDomain: "velavit-8cd8e.firebaseapp.com",
    projectId: "velavit-8cd8e",
    storageBucket: "velavit-8cd8e.firebasestorage.app",
    messagingSenderId: "1010351240818",
    appId: "1:1010351240818:web:133349a68e041f0d4c34eb"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);

// =========== STORAGE FUNCTIONS ===========

export const uploadImageToFirebase = async (file: File): Promise<string> => {
    if (!file) throw new Error("Dosya seçilmedi");

    // Create a unique filename
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    const storageRef = ref(storage, `uploads/${filename}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get public URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

// =========== ADMIN / LOGGING FUNCTIONS ===========

export interface UsageLog {
    timestamp: Date;
    scenario: string;
    aspectRatio: string;
    imageCount: number;
    status: "success" | "error";
    errorMessage?: string;
}

export const logApiUsage = async (data: UsageLog): Promise<void> => {
    try {
        await addDoc(collection(db, "admin_usage"), {
            ...data,
            timestamp: Timestamp.fromDate(data.timestamp)
        });
        console.log("[Firebase] Usage logged:", data.scenario);
    } catch (error) {
        console.error("[Firebase] Failed to log usage:", error);
        // Don't throw - logging failure shouldn't break the app
    }
};

export const getUsageStats = async () => {
    try {
        const usageRef = collection(db, "admin_usage");
        const q = query(usageRef, orderBy("timestamp", "desc"), limit(50));
        const snapshot = await getDocs(q);

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || new Date()
        }));

        const total = snapshot.size;
        const successCount = logs.filter((l: any) => l.status === "success").length;

        return {
            total,
            successCount,
            recentLogs: logs.slice(0, 20)
        };
    } catch (error) {
        console.error("[Firebase] Failed to get stats:", error);
        return { total: 0, successCount: 0, recentLogs: [] };
    }
};

