import axios from "axios";
import IRequest from "@/core/types/IRequest";
import {error} from "next/dist/build/output/log";

const base = process.env.NEXT_PUBLIC_API_URL;
if(!base) throw new Error("No base URL");
const agent = axios.create({
    baseURL: base.concat("/api/v1"),
    adapter: "fetch",
})

export type response<T> = {
    data: T,
    message: string
    meta: dict[]
}
export type dict = {key: string, value: string | number};
class Request implements IRequest {
    private async composeURL(url: string, params?: dict[]) {
        if(!params) return url;
        const searchParams = new URLSearchParams();
        params.forEach(param => {
            const value = typeof param.value === "string" ? param.value : param.value.toString();
            searchParams.append(param.key, value);
        });
        const queryString = searchParams.toString();
        return queryString ? `${url}?${queryString}` : url;
    }
    async get(url: string, params: dict[]) {
        const finalPath = await this.composeURL(url, params);
        return agent.get(finalPath);
    }
}
const request = new Request()
export default request;