"use client"

import {ResidentsTable} from "@/components/residents/ResidentsTable";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Megaphone} from "lucide-react";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {useState} from "react";

const Page = () => {

    //initialize router
    const router = useRouter()

    //initialize useState hooks
    const [searchQuery, setSearchQuery] = useState('');

    //routing
    const handleClick = () => {
        router.push('/home')
    }

    // routing
    const announcementButton = () => {
        router.push('/announcements')
    }

    return (
        <div>
            <div className="h-[56px] flex items-center justify-between pr-[40px]">
                <div className="flex flex-row justify-between py-[15px] px-[40px]">
                    <button className="bg-0 text-primary" onClick={handleClick}><ArrowLeft/></button>
                    <div className="pl-[15px] text-2xl">
                        Residents
                    </div>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                    <div className="w-full"><Input type="text" placeholder="search" onChange={(e) => setSearchQuery(e.target.value)}/></div>
                    <div className="pl-[15px]"><Button className="bg-[#101863]" onClick={announcementButton}><Megaphone/>Announcements</Button></div>
                </div>
            </div>
            <div>
                <div className="px-10 py-[21px]"><ResidentsTable searchQuery={searchQuery}/></div>
            </div>
        </div>
    );
}

export default Page