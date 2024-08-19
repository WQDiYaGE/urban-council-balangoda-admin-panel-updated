"use client";

import { useEffect, useState } from "react";
import { getAllAnnouncements } from "@/app/(application)/(sections)/announcements";
import { LoaderCircle } from "lucide-react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { formatFirestoreTimestamp } from "@/utils/functions";

type Announcement = {
    subject: string;
    date: {
        seconds: number;
        nanoseconds: number;
    };
    message: string;
    id: string;
};

export const AnnouncementHistory = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState<Boolean>();
    const [error, setError] = useState<string | null>();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const data = await getAllAnnouncements();
                setAnnouncements(data.data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
                setError("Failed to fetch announcements");
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="w-full h-fit">
            {loading ? (
                <div className="flex flex-col justify-center items-center h-1/2 w-full">
                    <div className="p-5">Loading Table Data...</div>
                    <div>
                        <LoaderCircle className="animate-spin" />
                    </div>
                </div>
            ) : error ? (
                <div className="flex justify-center w-full">{error}</div>
            ) : (
                <div className="overflow-auto h-[400px]">
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn className="text-left px-5 w-1/5 border border-[#607D8B] bg-[#CFD8DC]">
                                Date
                            </TableColumn>
                            <TableColumn className="text-left px-5 border border-[#607D8B] bg-[#CFD8DC]">
                                Message
                            </TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No rows to display."} className="max-h-[calc(100vh-100px)] overflow-y-auto">
                            {announcements
                                .sort((a, b) => b.date.seconds - a.date.seconds) // Sorting by date (newest first)
                                .map((announcement) => (
                                        <TableRow key={announcement.id} className="border border-[#607D8B]">
                                        <TableCell className="py-5">
                                            {formatFirestoreTimestamp({
                                                seconds: announcement.date.seconds,
                                                nanoseconds: announcement.date.nanoseconds,
                                            })}
                                        </TableCell>
                                        <TableCell className="py-5 border border-[#607D8B]">
                                            {announcement.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};
