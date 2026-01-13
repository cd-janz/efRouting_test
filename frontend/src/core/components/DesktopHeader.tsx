"use client"
import {PanelRight} from "lucide-react";
import {useSidebar} from "@/core/components/ui/sidebar";

export default function DesktopHeader() {
    const side = useSidebar()
    return(
        <header className="desk">
            <PanelRight onClick={()=> side.setOpen(!side.open)} width={20} height={20} className="cursor-pointer"/>
            <p>SpaceX Launch info</p>
        </header>
    )
}