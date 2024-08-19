import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import { storage } from "@/lib/firebase";

export const formatFirestoreTimestamp = (timestamp: { seconds: number, nanoseconds: number }): string => {
    // Convert Firestore timestamp to milliseconds
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

    // Create a JavaScript Date object
    const date = new Date(milliseconds);

    // Extract the date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    // Extract the time components. include them in your output if necessary
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format the date and time
    return `${day}/${month}/${year} : ${hours}.${minutes}`;
}

export const uploadImages = async (files: FileList): Promise<string[]> => {
    const uploadPromises = Array.from(files).map(async (file) => {
        // Create a reference to the storage location with a unique path
        const fileRef = ref(storage, `news/${file.name}`);
        await uploadBytes(fileRef, file); // Upload the file
        // Get the file's download URL
        return await getDownloadURL(fileRef);
    });

    return Promise.all(uploadPromises); // Wait for all uploads to complete
};