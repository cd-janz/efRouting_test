import LaunchesTable from "@/modules/launches/components/LaunchesTable";
export default function LaunchesListEntry(){
    return(
        <div className="flex flex-col gap-10 py-5">
            <LaunchesTable/>
        </div>
    )
}