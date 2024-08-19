"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import {useEffect, useState} from "react";
import Cookie from "js-cookie";
import Image from "next/image";

export const SectionsNavbar = () => {

    const [name, setName] = useState("aaa")
    const [userId, setUserId] = useState("")
    const [loading, setLoading] = useState<Boolean>(false)
    let imageUrl = ""

    useEffect(() => {
        const getCookieData = async () => {
            const userData = Cookie.get('userData');
            const user = userData ? JSON.parse(userData) : null;
            setName(user?.firstName + " " + user?.lastName)
            setUserId(user?.id)
            setLoading(true)
            imageUrl = userId + ".png"
        }

        getCookieData()

    }, []);


    console.log(imageUrl)

    return(
        <div>
            <div className="flex flex-row py-[11px] justify-between border-b">
                <div className="px-[40px]">
                    <div><Image src="/logo.png" width={100} height={80} alt="logo.png"/></div>
                </div>
                <div className="flex flex-row px-[40px]">
                <div>
                        <Avatar>
                            <AvatarImage src={imageUrl}/>
                            <AvatarFallback>
                                <Skeleton className="h-12 w-12 rounded-full"/>
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex flex-col px-[20px] font--[600] text-[15px] gap-2">

                        {/*{*/}
                        {/*    !loading ? <div><Skeleton className="h-4 w-[150px]"/></div> :*/}
                        {/*        <div>{name}</div>*/}
                        {/*}*/}
                        <div><Skeleton className="h-4 w-[150px]"/></div>
                        <div>Admin</div>
                    </div>
                </div>

            </div>

        </div>
    )
}