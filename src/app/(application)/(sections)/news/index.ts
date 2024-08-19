import axios from "@/lib/axios";
import {Timestamp} from "firebase/firestore";
import {NextResponse} from "next/server";

/*
this method calls the backend API route api/news.
this file is in the api/news folder
this method is called on the page.tsx file tor execution.
used to get all details of news
 */
export const getAllNews = async () => {
    try {
        const response = await axios.get('/api/news');
        return response.data
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

/*
this method calls the backend API route api/news.
this file is in the api/news folder
this method is called on the page.tsx file tor execution.
used to create a news
 */
export const createNews = async (body: {
    date: Timestamp;
    imageUrls: string[];
    description: string;
    location: string;
    id: string;
    title: string;
}) => {
    try {
        const response = await axios.post('/api/news', body);
        // Assuming the API response contains a message
        const res = { data: response.data, message: "News created successfully" };
        console.log(res);
        return res;
    } catch (error) {
        console.error('Error creating announcement:', error);
        // Provide error message from backend or a default message
        return { error: error || 'Failed to create announcement' };
    }
}

/*
this method is used to update a news
 */
export const updateNews = async (body: any) => {
    if(!body.id){
        return NextResponse.json({
            message: "Id is missing"
        })
    }

    if(!body.description){
        return NextResponse.json({
            message: null
        })
    }

    try {
        const response = await axios.patch('/api/news', body);
        return { data: response.data, message: "News updated successfully" };
    } catch (error) {
        console.error('Error updating news:', error);
        return { error: 'Failed to update news' };
    }
};

/*
this method is used to delete a news
 */
export const deleteNews = async (id: string | null) => {
    if (!id) {
        console.error('ID is required for deleting news');
        return { error: 'ID is required for deleting news' };
    }

    try {
        const response = await axios.delete(`/api/news?id=${id}`);
        console.log("News Deleted Successfully")
        return { data: response.data, message: "News deleted successfully" };
    } catch (error) {
        console.error('Error deleting news:', error);
        return { error: 'Failed to delete news' };
    }
};