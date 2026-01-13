export default interface IRequest {
    get: (url: string, params: { key: string, value: string }[]) => Promise<any>;
}