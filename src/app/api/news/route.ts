import {addDoc, collection, deleteDoc, getDocs, Timestamp, updateDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase";
import {NextRequest, NextResponse} from "next/server";
import {query} from "@firebase/firestore";

export const GET = async () => {
    try {
        const newsCollection = collection(db, 'news');
        const newsSnapshot = await getDocs(newsCollection);
        const data = newsSnapshot.docs.map(doc => doc.data());

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching news data:', error);
        return NextResponse.json({ error: 'Failed to fetch news data' });
    }
};

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { title, description, location, date, id, imageUrls } = body;

        // Ensure required fields are present
        if (!title || !description || !location) {
            return NextResponse.json({ error: 'Title, description, and location are required' }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        // Ensure date is a Firestore Timestamp
        const firestoreDate = typeof date === 'object' && date instanceof Timestamp ? date : Timestamp.fromMillis(new Date(date).getTime());

        // Ensure imageUrls is an array
        const images = Array.isArray(imageUrls) ? imageUrls : [];

        // Add the news document to Firestore
        const newsCollection = collection(db, 'news');
        await addDoc(newsCollection, { title, description, location, date: firestoreDate, id, imageUrls: images });

        return NextResponse.json({ message: 'News added successfully' });
    } catch (error) {
        console.error('Error adding news:', error);
        return NextResponse.json({ error: 'Failed to add news' }, { status: 500 });
    }
};

export const PATCH = async (request: NextRequest) => {
    const body = await request.json();
    const { id, description } = body;

    if (!id) {
        return NextResponse.json({ error: 'ID is required for updating the record' }, { status: 400 });
    }

    try {
        const newsCollection = collection(db, 'news');
        const newsQuery = query(newsCollection, where("id", "==", id));
        const newsSnapshot = await getDocs(newsQuery);

        if (newsSnapshot.empty) {
            return NextResponse.json({ error: 'No record found with the provided ID' }, { status: 404 });
        }

        const newsDoc = newsSnapshot.docs[0].ref;
        await updateDoc(newsDoc, { description });

        return NextResponse.json({ message: 'News updated successfully' });
    } catch (error) {
        console.error('Error updating news:', error);
        return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        // Extract the `id` from the URL path
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required for deletion' }, { status: 400 });
        }

        const newsCollection = collection(db, 'news');
        const newsQuery = query(newsCollection, where("id", "==", id));
        const newsSnapshot = await getDocs(newsQuery);

        if (newsSnapshot.empty) {
            return NextResponse.json({ error: 'No record found with the provided ID' }, { status: 404 });
        }

        const newsDoc = newsSnapshot.docs[0].ref;
        await deleteDoc(newsDoc);

        return NextResponse.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }
};