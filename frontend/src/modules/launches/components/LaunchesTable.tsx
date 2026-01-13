"use client"
import useTable from "@/modules/launches/hooks/useTable";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/core/components/ui/table";
import {useCallback} from "react";
import {TableSearch, TableStatus} from "@/core/components/Table";
import {filters} from "@/modules/launches/data/Table";

export default function LaunchesTable(){
    const table = useTable("/launches/all");
    const handleDate = useCallback((date?: string)=> {
        if(!date) return "";
        else if(date.trim().length === 0) return "";
        return new Date(date).toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric',
           hour: '2-digit',
           minute: '2-digit'
       });
    }, [])
    return(
        <>
            <div className="flex items-center justify-between gap-10">
                <div className="hidden"/>
                <TableSearch filters={filters}
                             onSearch={(value, filter, reset)=> {
                                 console.log("value2: ", value);
                                 if(reset) {
                                     console.log("must reset")
                                     table.getNextStack(undefined, reset).catch(err=> console.log(err));
                                     return
                                 }
                                 table.getNextStack({key: filter, value: value}).catch(err => console.log(err));
                             }}/>
            </div>
            <Table>
                <TableCaption>
                    <button className="bg-blue-600 capitalize text-white w-80 h-9 rounded-xl"
                            onClick={() => table.getNextStack()}>
                        {table.hasMore ? "load more" : "ain't more data to show"}
                    </button>
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableHead>ID</TableHead>
                        <TableHead>Mission</TableHead>
                        <TableHead>Rocket</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead>Upcoming</TableHead>
                        <TableHead>Flight</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {table.data !== null && table.data.map((row, i) => (
                        <TableRow key={row.launch_id}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell className="max-w-24 overflow-hidden text-ellipsis">{row.launch_id}</TableCell>
                            <TableCell>{row.mission_name}</TableCell>
                            <TableCell className="max-w-24 overflow-hidden text-ellipsis">{row.rocket_id}</TableCell>
                            <TableCell>{handleDate(row.launch_date)}</TableCell>
                            <TableCell><TableStatus label={row.success ? "right" : "fail"} status={row.success}/></TableCell>
                            <TableCell><TableStatus label={row.upcoming ? "yes" : "no"} status={row.upcoming}/></TableCell>
                            <TableCell>#{row.flight_number}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}