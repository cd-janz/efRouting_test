import {useCallback, useEffect, useState} from "react";
import ILaunch from "@/modules/launches/types/ILaunch";
import request, {dict, response} from "@/core/api/agent";

const limit = 50;
export default function useTable(url: string){
    const [data, setData] = useState<ILaunch[]>([]);
    const [cursor, setCursor] = useState<string|null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const handleParams = useCallback((newParam?: dict, reset?: boolean):dict[] => {
        const params: dict[] = []
        if(!newParam){
            params.push({key: 'limit', value: limit});
            if(cursor && !reset) params.push({key: 'cursor', value: cursor});
        }else{
            params.push(newParam);
        }
        return params
    }, [cursor])

    const handleLoadData = useCallback((data: ILaunch[], alt: boolean) => {
        if(!alt){
            setData(prev => [...prev, ...data]);
            return
        }
        setData(data);
    }, [setData])

    const getNextStack = useCallback(async(newParam?: dict, reset?: boolean)=>{
        if ((loading || !hasMore) && !newParam && !reset) return;
        setLoading(true);
        try {
            const params =  handleParams(newParam, reset);
            const res = await request.get("/launches/all", params)
            if(res.status >= 200 && res.status < 300){
                const response: response<ILaunch[]> = res.data;
                const cursorRes = response.meta.find(i => i.key === 'cursor');
                const data = response.data;
                handleLoadData(data, Boolean(reset || newParam))
                if (cursorRes && !newParam && cursorRes.value) {
                    const value = typeof cursorRes.value === 'string'
                        ? cursorRes.value
                        : cursorRes.value.toString();
                    setCursor(value);
                    setHasMore(true);
                } else {
                    setCursor(null);
                    setHasMore(false);
                }
            }
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    }, [cursor, hasMore, loading, handleParams, handleLoadData])

    useEffect(()=>{
        // Inst first load
        getNextStack(undefined, true).catch(()=> console.log("Error loading launches"));
    }, [])

    return { data, loading, hasMore, getNextStack }
}