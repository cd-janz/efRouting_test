import Header from "@/core/components/Header";

interface Props{
    children?: React.ReactNode
}
export default function CoreLayout(props: Props){
    return(
        <>
            <Header/>
            {props.children}
        </>
    )
}