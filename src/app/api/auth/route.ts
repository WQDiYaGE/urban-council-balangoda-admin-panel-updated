import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const POST = async (req: NextRequest) => {
    try {
        // Read the JSON body from the request
        const body = await req.json();

        // Extract email and password from the body
        const { email, password } = body;

        // Check if both email and password are provided
        if (!email || !password) {
            return NextResponse.json({
                status: 400,
                message: 'Email and password are required',
                data: null
            });
        }

        // Query the Firestore collection where email matches the input
        const adminCollection = collection(db, 'admin');
        const q = query(adminCollection, where('email', '==', email));
        const adminSnapshot = await getDocs(q);

        // Check if any documents were found
        if (adminSnapshot.empty) {
            return NextResponse.json({
                status: 404,
                message: 'No admin found with the provided email',
                data: null
            });
        }

        // Extract data from the snapshot and ensure the password field exists
        const data = adminSnapshot.docs.map(doc => {
            const docData = doc.data();
            return { id: doc.id, ...docData } as { id: string, password: string, [key: string]: any };
        });

        // Ensure the password exists in the document
        if (!data[0].password) {
            return NextResponse.json({
                status: 500,
                message: "Data inconsistency: password field is missing",
                data: null
            });
        }

        // Check if the password matches
        if (data[0].password !== password) {
            return NextResponse.json({
                status: 400,
                message: "Username or password is incorrect",
                data: null
            });
        }

        // Combine all user data into a single cookie
        const userData = JSON.stringify({
            email: data[0].email,
            firstName: data[0].first_name,
            lastName: data[0].last_name,
            imageURL: data[0].imageUrl,
            id: data[0].id
        });

        const res = NextResponse.json({
            status: 200,
            message: "Success",
            data: data[0]
        });

        // Set the combined cookie
        res.cookies.set('userData', userData, { maxAge: 60 * 60 * 24 });

        return res;

    } catch (error) {
        console.error('Error handling request:', error);
        return NextResponse.json({
            status: 500,
            message: 'Failed to handle request',
            data: null
        });
    }
};
