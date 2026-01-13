"use client"
import {cn} from "@/core/lib/utils";
import {CheckIcon, ChevronsUpDown, SearchIcon} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/core/components/ui/popover";
import {Button} from "@/core/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/core/components/ui/command";
export function TableStatus({label, status}: {label: string, status: boolean}) {
    return(
        <div className={cn("px-4 py-1 text-center rounded-2xl", status ? "bg-emerald-600" : "bg-rose-600")}>
            <span className="font-medium text-sm capitalize text-white">{label}</span>
        </div>
    )
}
interface TableSearchProps{
    filters: string[]
    onSearch: (value: string, filter: string, reset: boolean) => void
}
export function TableSearch(props: TableSearchProps){
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [type, setType] = useState<"text" | "number">("text");
    const [hasChange, setHasChange] = useState<boolean>(false);
    const handleInput = useCallback((value: string, type: string, filter: string | null) => {
        if(!hasChange){
            setHasChange(true);
        }
        if(filter === null || filter === "")return;
        if (value === "") {
            setInputValue(value);
            return;
        }
        if (type === "number") {
            const numberValue = Number(value);
            if (Number.isNaN(numberValue) || value.trim() === "") return;
        }
        setInputValue(value);
    }, [hasChange]);
    useEffect(() => {
        const handler = setTimeout(() => {
            if (!value) return;
            console.log("has change", hasChange);
            const isEmpty = inputValue.trim() === "";
            if (!isEmpty) {
                props.onSearch(inputValue, value, false);
                return;
            }
            if (isEmpty && hasChange) {
                console.log("Input limpiado por usuario -> Disparando Reset");
                props.onSearch("", "", true);
            }
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, value, hasChange]);

    return(
        <div className="flex items-center gap-0.5 w-full">
            <div className="flex items-center border border-gray-200 w-fit py-0.5 pl-2 gap-1 h-10 rounded-l-md">
                <SearchIcon className="text-gray-400" width={24} height={24}/>
                <input type="text" className="w-full outline-none placeholder:text-sm placeholder:font-light"
                       onChange={(e)=> handleInput(e.currentTarget.value, type, value)}
                       value={inputValue} placeholder="No data typed"/>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="box-border">
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-32 h-10 rounded-l-none justify-between">
                        <p className="max-w-full overflow-hidden capitalize text-gray-500">
                            {value !== null ? value : "Filters"}
                        </p>
                        <ChevronsUpDown className="opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-64 p-0" align="end">
                    <Command>
                        <CommandInput placeholder="Search a filter" className="h-8"/>
                        <CommandList>
                            <CommandEmpty>No filters found</CommandEmpty>
                            <CommandGroup>
                                {props.filters.map((filter, i)=> (
                                    <CommandItem key={i} value={filter} onSelect={()=> {
                                        if(value === filter) {
                                            setValue(null)
                                            return;
                                        }
                                        if(filter === "month" || filter === "year") {
                                            setType("number");
                                            setInputValue("");
                                        }else setType("text")
                                        setValue(filter)
                                        setOpen(false);
                                    }}>
                                        <span className="capitalize text-base">{filter}</span>
                                        <CheckIcon className={cn("ml-auto", value === filter ? "opacity-100" : "opacity-0")}/>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}