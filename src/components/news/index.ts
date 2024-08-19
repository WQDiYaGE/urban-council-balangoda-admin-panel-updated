import {Timestamp} from "firebase/firestore";
import {formatFirestoreTimestamp} from "@/utils/functions";

export const convertDate = (date: Timestamp) => {
    return formatFirestoreTimestamp(date);
};
