import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/core/components/ui/sidebar";
import header from "@/core/content/header";
import Link from "next/link";

const data = header.nav
export default function DesktopSidebar() {
    return(
        <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader></SidebarHeader>
            <SidebarContent>
                {data.map((group, index)=> (
                    <SidebarGroup key={index}>
                        <SidebarGroupLabel>Launches</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item, i) => (
                                    <SidebarMenuItem key={i}>
                                        <SidebarMenuButton asChild>
                                            <Link href={group.basePath.concat(item.path)}>
                                                <item.icon width={24} height={24}/>
                                                <span className="capitalize">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    )
}