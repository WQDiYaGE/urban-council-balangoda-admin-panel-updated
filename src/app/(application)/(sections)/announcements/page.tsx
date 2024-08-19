"use client"

import {CreateAnnouncement} from "@/components/announcements/CreateAnnouncement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {AnnouncementHistory} from "@/components/announcements/AnnouncementHistory";
import {ArrowLeft, Megaphone, Newspaper} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const Page = () => {

    //initializing router for routing
    const router = useRouter()

    //routing
    const handleClick = () => {
        router.push('/home')
    }

    //routing
    const announcementButton = () => {
        router.push('/residents')
    }

    //routing
    const newsButton = () => {
        router.push('/news')
    }

    return (
        <div>
            <div className="h-[56px] flex items-center justify-between pr-[40px]">
                <div className="flex flex-row justify-between py-[15px] px-[40px]">
                    <button className="bg-0 text-primary" onClick={handleClick}><ArrowLeft/></button>
                    <div className="pl-[15px] text-2xl">
                        Announcements
                    </div>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                    <div className="pl-[15px]"><Button className="bg-[#101863]"
                                                       onClick={newsButton}><Newspaper/>News</Button>
                    </div>

                    <div className="pl-[15px]"><Button className="bg-[#101863]"
                                                       onClick={announcementButton}><Megaphone/>Residents
                        Details</Button>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <Tabs defaultValue="newAnnouncement" className="px-10 py-14">
                    <TabsList className="w-fit self-center bg-0">
                    <TabsTrigger value="newAnnouncement" className="">New Announcement</TabsTrigger>
                        <TabsTrigger value="announcementHistory">Announcement History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="newAnnouncement"><CreateAnnouncement/></TabsContent>
                    <TabsContent value="announcementHistory"><AnnouncementHistory/></TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default Page