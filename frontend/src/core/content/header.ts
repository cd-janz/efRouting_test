export interface INavItem{
    label: string;
    path: string;
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
                { label: "list", path: '/list' },
                { label: "dashboard", path: "/dashboard" },
            ]
        }
    ]
}
export default header;