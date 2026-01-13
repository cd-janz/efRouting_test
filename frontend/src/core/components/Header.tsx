"use client";
import "@/core/styles/header.css"
import {MenuIcon} from "lucide-react";
import header from "@/core/content/header";
import MobileSidebar from "@/core/components/MobileSidebar";
import {useCallback, useState} from "react";
export default function Header(){
    const [isActive, setIsActive] = useState<boolean>(false);
    const handleClose = useCallback(() => {
        setIsActive(false);
    }, [])
    return(
        <>
            <header className="border-b border-gray-200">
                <h2>{header.title}</h2>
                <MenuIcon onClick={()=>setIsActive(true)}
                          width={26} height={26}
                          className="cursor-pointer p-0.5 hover:bg-gray-600 rounded-md hover:text-white" />
            </header>
            <MobileSidebar active={isActive} handle={handleClose} items={header.nav}/>
        </>
    )
}