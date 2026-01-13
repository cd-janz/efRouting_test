import {cn} from "@/core/lib/utils";
import {XIcon} from "lucide-react";
import Link from 'next/link'
import {INavGroup} from "@/core/content/header";

interface Props{
    items: INavGroup[]
    active: boolean
    handle: ()=>void
}
export default function MobileSidebar(props: Props){
    return(
        <div className={cn("mobile sidebar bg-white", props.active && "open")}>
            <button onClick={props.handle} className="hover:bg-gray-200 cursor-pointer focus:bg-gray-200">
                <XIcon width={28} height={28} />
            </button>
            <ul className="mobile_list-container">
                {props.items.map((item, index) =>(
                    <li key={index} className="mobile_list-item">
                        <span className="capitalize font-light text-sm">{item.label}</span>
                        <div className="pl-2 flex flex-col gap-2">
                            {item.items.map((item2, index2) =>(
                                <Link key={index2} href={item.basePath.concat(item2.path)}
                                      className="px-8 py-2 capitalize font-light bg-blue-50 rounded-md focus:bg-blue-400">
                                    {item2.label}
                                </Link>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}