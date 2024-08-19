import {NextRequest, NextResponse} from "next/server";
import {collection, getDocs, updateDoc, where} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Admin } from "@/types";
import {query} from "@firebase/firestore";

export const GET = async () => {
    try {
        const residentCollection = collection(db, 'residents');
        const residentSnapshot = await getDocs(residentCollection);
        const data = residentSnapshot.docs.map(doc => doc.data() as Admin);

        return NextResponse.json({ data: data });
    } catch (error) {
        console.error('Error fetching resident data:', error);
        return NextResponse.json({ error: 'Failed to fetch resident data' });
    }
};

export const PATCH = async (request: NextRequest) => {

    if(!request){
        return NextResponse.json({
            error: 'No Request Body Found'
        })
    }

    const body = await request.json();
    const { id, first_name, last_name, email, phone } = body;

    if (!id) {
        return NextResponse.json({ error: 'ID is required for updating the record' }, { status: 400 });
    }
    try {
        const residentsCollection = collection(db, 'residents');
        const residentQuery = query(residentsCollection, where("id", "==", id));
        const residentSnapshot = await getDocs(residentQuery);

        if (residentSnapshot.empty) {
            return NextResponse.json({ error: 'No record found with the provided ID' }, { status: 404 });
        }

        const newsDoc = residentSnapshot.docs[0].ref;
        await updateDoc(newsDoc, { id, first_name, last_name, email, phone });

        return NextResponse.json({ message: 'Resident Details updated successfully' });
    } catch (error) {
        console.error('Error updating Resident Details:', error);
        return NextResponse.json({ error: 'Failed to update Resident Details' }, { status: 500 });
    }
};