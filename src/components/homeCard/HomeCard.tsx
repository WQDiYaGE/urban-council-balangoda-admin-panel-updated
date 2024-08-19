import React from "react";
import Link from "next/link";

interface HomeCardProps {
    href: string;
    title: string;
    icon: React.ReactElement<any>;
}

export const HomeCard: React.FC<HomeCardProps> = ({ href, title, icon }) => {
    return (
        <div className="flex justify-end bg-amber-900 w-[394px] h-[215px] rounded-lg">
            <Link className="rounded-lg bg-[#101863] w-[394px] h-full text-white" href={href}>
                <div className="flex flex-col justify-center items-center rounded-lg w-full h-full">
                    {React.cloneElement(icon, { width: 48, height: 48 })}
                    <div className="px-10">{title}</div>
                </div>
            </Link>
        </div>
    );
};