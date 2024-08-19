import {CalendarCheck2, Megaphone, Newspaper, Users} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {HomeCard} from "@/components/homeCard/HomeCard";

const Page = () => {
    return (
        <div>
            <div className="flex flex-col pt-10 justify-center items-center">
                <div><Image src="/logo.png" width={150} height={120} alt="logo.png"/></div>
                <div className="font[800] text-[32px] pb-[80px] pt-[10px]">Balangoda Urban Council</div>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-y-4 sm:grid-cols-1 h-fit">
                <div className="w-full flex justify-center items-center"><HomeCard href="/residents" title="Residents" icon={<Users/>}/></div>
                <div className="w-full flex justify-center items-center"><HomeCard href="/announcements" title="announcements" icon={<Megaphone/>}/></div>
                <div className="w-full flex justify-center items-center"><HomeCard href="/news" title="News" icon={<Newspaper/>}/></div>

            </div>
        </div>
    );
};
export default Page
