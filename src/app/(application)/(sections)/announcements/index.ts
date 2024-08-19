import axios from '@/lib/axios';


/*
this method calls the backend API route api/announcements.
this file is in the api/announcement folder
this method is called on the page.tsx file tor execution.
used to get all details of announcements
 */
export const getAllAnnouncements = async () => {
    try {
        const response = await axios.get('/api/announcements');
        return response.data
    } catch (error) {
        console.error('Error fetching residents:', error);
        return [];
    }
};

/*
this method calls the backend API route api/announcements.
this file is in the api/announcement folder
this method is called on the page.tsx file tor execution.
used to create a new announcements
 */
export const createAnnouncement = async (body: {date: {seconds: number, nanoseconds: number}, subject: string, message: string, id: string}) => {
    try {
        const response = await axios.post('/api/announcements', body);
        // Assuming the API response contains a message
        const res = { data: response.data, message: "Announcement created successfully" };
        console.log(res);
        return res;
    } catch (error) {
            console.error('Error creating announcement:', error);
            return { error: 'Failed to create announcement' };
        }
}