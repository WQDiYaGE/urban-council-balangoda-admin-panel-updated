"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {ArrowLeft, Megaphone, User2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {CreateNews} from "@/components/news/CreateNews";
import {NewsHistory} from "@/components/news/NewsHistory";

const Page = () => {

    //initialize router
    const router = useRouter()

    //routing
    const handleClick = () => {
        router.push('/home')
    }

    //routing
    const announcementButton = () => {
        router.push('/announcements')
    }

    //routing
    const residentsButton = () => {
        router.push('/residents')
    }

    return (
        <div>
            <div className="h-[56px] flex items-center justify-between pr-[40px]">
                <div className="flex flex-row justify-between py-[15px] px-[40px]">
                    <button className="bg-0 text-primary" onClick={handleClick}><ArrowLeft/></button>
                    <div className="pl-[15px] text-2xl">
                        News
                    </div>

                </div>
                <div className="flex flex-row w-1/2 justify-end">
                    <div className="pl-[15px]"><Button className="bg-[#101863]"
                                                       onClick={announcementButton}><div className="pr-5"><Megaphone/></div>Announcements
                    </Button>
                    </div>

                    <div className="pl-[15px]"><Button className="bg-[#101863]" onClick={residentsButton}><div className="pr-5"><User2/></div>Residents
                        Details</Button></div>

                </div>
            </div>

            <div className="w-full">
                <Tabs defaultValue="newAnnouncement" className="px-10 py-14">
                    <TabsList className="w-fit self-center bg-0">
                        <TabsTrigger value="newAnnouncement" className="">Create News</TabsTrigger>
                        <TabsTrigger value="announcementHistory">News History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="newAnnouncement"><CreateNews/></TabsContent>
                    <TabsContent value="announcementHistory"><NewsHistory/></TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default Page