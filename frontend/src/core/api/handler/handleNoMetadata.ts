import request, {response} from "@/core/api/agent";

const handleNoMetadata = async <T>(url: string) => {
    const res = await request.get(url, [])
    if (res.status >= 200 && res.status < 300) {
        const response: response<T> = res.data
        return response.data;
    }
    return Promise.reject(res.statusText);
}

export default handleNoMetadata;
