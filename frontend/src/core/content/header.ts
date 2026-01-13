import {CircleGaugeIcon, LucideProps, TablePropertiesIcon} from "lucide-react";
import {ForwardRefExoticComponent, RefAttributes} from "react";

export interface INavItem{
    label: string;
    path: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}
export interface INavGroup{
    label: string;
    basePath: string;
    items: INavItem[];
}
export interface IHeader {
    title: string;
    nav: INavGroup[];
}

const header: IHeader = {
    title: "SpaceX",
    nav: [
        {
            label: "launches",
            basePath: "/launches",
            items: [
                { label: "list", path: '/list', icon: TablePropertiesIcon },
                { label: "dashboard", path: "/dashboard", icon: CircleGaugeIcon },
            ]
        }
    ]
}
export default header;