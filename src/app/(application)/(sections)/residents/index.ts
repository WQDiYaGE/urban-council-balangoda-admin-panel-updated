import axios from '@/lib/axios';
import {NextResponse} from "next/server";

/*
this method calls the backend API route api/residents.
this file is in the api/residents folder
this method is called on the page.tsx file tor execution.
used to get all details of residents
 */
export const getAllResidents = async () => {
    try {
        const response = await axios.get('/api/residents')
        return response.data
    } catch (error) {
        console.error('Error fetching residents:', error);
        return [];
    }
};

/*
update resident details
 */
export const updateResident = async (body: {
    phone: string;
    last_name: string;
    id: string;
    first_name: string;
    email: string
}) => {

    try {
        const response = await axios.patch('/api/residents', body);
        console.log("response in index")
        console.log(response)
        if(response.status !== 400){
            return { data: response.data, message: "Resident update failed", error: true };
        }
        console.log(response)
        return { data: response.data, message: "Resident updated successfully" };
    } catch (error) {
        console.error('Error updating resident:', error);
        return { error: 'Failed to update resident' };
    }
};