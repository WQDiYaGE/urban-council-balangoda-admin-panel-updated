"use client"
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Skeleton} from "@/components/ui/skeleton"
import Cookie from 'js-cookie';
import {useEffect, useState} from "react";

export const Navbar = () => {
    const router = useRouter()

    const [name, setName] = useState("aaa")
    const [loading, setLoading] = useState<Boolean>(false)

    const handleClick = () => {
        router.back()
    }

    useEffect(() => {
        const getCookieData = async () => {
            const userData =  Cookie.get('userData');
            const user =  userData ? JSON.parse(userData) : null;
            setName(user?.firstName + " " + user?.lastName)
            setLoading(true)
        }

        getCookieData()

    }, []);



    return (
        <div
            className="flex flex-row w-full h-[64px] items-center justify-between border-b border-[#CFD8DC]  py-[10px]">
            <div className="px-[40px]">
                <button className="bg-0 text-primary" onClick={handleClick}><ArrowLeft/></button>
            </div>
            <div>
                <div className="flex flex-row items-center">
                    <Avatar>
                        <AvatarImage src={``}/>
                        <AvatarFallback>
                            <Skeleton className="h-12 w-12 rounded-full"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col px-[20px] font--[600] text-[15px] gap-2">

                        {/*{*/}
                        {/*    !loading? <div><Skeleton className="h-4 w-[150px]"/></div> :*/}
                        {/*        <div>{name}</div>*/}
                        {/*}*/}
                        <div><Skeleton className="h-4 w-[150px]"/></div>
                        <div>Admin</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
