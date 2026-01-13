import Header from "@/core/components/Header";
import {SidebarProvider} from "@/core/components/ui/sidebar";
import DesktopSidebar from "@/core/components/Sidebar";
import DesktopHeader from "@/core/components/DesktopHeader";

interface Props{
    children?: React.ReactNode
}
export default function CoreLayout(props: Props){
    return(
        <>
            <div className="lg:hidden flex flex-col h-dvh overflow-hidden">
                <Header/>
                <main className="flex-1 w-full relative px-3">
                    {props.children}
                </main>
            </div>
            <div className="hidden lg:block w-dvw h-dvh overflow-hidden">
                <SidebarProvider defaultOpen={false} className="flex w-full h-full">
                    <DesktopSidebar/>
                    <main className="flex-1 min-w-0 h-full px-6 box-border flex flex-col overflow-hidden">
                        <DesktopHeader/>
                        <div className="w-full flex-1 box-border overflow-y-auto overflow-x-hidden">
                            {props.children}
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        </>
    )
}