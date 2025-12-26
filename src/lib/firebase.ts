// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZs6FwcFtswfqpVL56988kTjMhXxyY6pE",
    authDomain: "velavit-8cd8e.firebaseapp.com",
    projectId: "velavit-8cd8e",
    storageBucket: "velavit-8cd8e.firebasestorage.app",
    messagingSenderId: "1010351240818",
    appId: "1:1010351240818:web:133349a68e041f0d4c34eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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
