import {addDoc, collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";
import {NextRequest, NextResponse} from "next/server";


/*
GET route for announcements
connects to firebase, fetch documents as an array. then mapped through each item
 */
export const GET = async () => {
    try {
        const announcementCollection = collection(db, 'announcements');
        const announcementSnapshot = await getDocs(announcementCollection);
        const data = announcementSnapshot.docs.map(doc => doc.data());

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching resident data:', error);
        return NextResponse.json({ error: 'Failed to fetch resident data' });
    }
};

export const POST = async (request: NextRequest) => {

    const body = await request.json()
    const { subject, message, date , id} = body;

    if (!subject || !message) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if(!id){
        return NextResponse.json({ error: 'There seems to be an error in Generating Unique ID' }, { status: 400 });
    }

    if(!date){
        return NextResponse.json({error: 'There seems to be an Error in Generating Date'}, {status: 400})
    }

    try {
        const announcementCollection = collection(db, 'announcements');
        await addDoc(announcementCollection, { subject, message, date, id });
        return NextResponse.json({ message: 'Announcement added successfully' });
    }catch (error){
        console.error('Error adding announcement:', error);
        return NextResponse.json({ error: 'Failed to add announcement' }, { status: 500 });
    }
}