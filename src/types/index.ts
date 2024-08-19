import {Timestamp} from "firebase/firestore";

export type Admin = {
    name: string;
    email: string;
    password: string;
}

export type Resident = {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
};

export type News = {
    title: string;
    description: string;
    date: Timestamp;
    imageUrls: string[];
    location: string;
    id: string;
};