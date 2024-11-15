import { Dictionary } from "common/src/tre/Dictionary";

export interface FetchParameters {
    url: string;
    token?: string;
    body?: any;
    corelation: string;
}

export class FetchWrapper {
    public static async delete(params: FetchParameters): Promise<void> {
        const headers = FetchWrapper.defaultHeaders(params.token);

        const response = await fetch(params.url, {
            method: "DELETE",
            headers: { ...headers, "corelation": params.corelation }
        });

        await FetchWrapper.handleResponse(response, false);
    }

    public static async get<T>(params: FetchParameters): Promise<T> {
        const headers = FetchWrapper.defaultHeaders(params.token);

        const response = await fetch(params.url, {
            method: "GET",
            headers: { ...headers, "corelation": params.corelation }
        });

        const ret = await FetchWrapper.handleResponse<T>(response);
        return ret;
    }

    public static async post<T>(params: FetchParameters): Promise<T> {
        const headers = FetchWrapper.defaultHeaders(params.token);

        const body = typeof params.body === "string" ? params.body : JSON.stringify(params.body);

        const response = await fetch(params.url, {
            method: "POST",
            body: body,
            headers: { ...headers, "corelation": params.corelation }
        });

        const ret = await FetchWrapper.handleResponse<T>(response);
        return ret;
    }

    private static defaultHeaders(token?: string): Dictionary<string> {
        const headers: Dictionary<string> = {};
        headers["Content-Type"] = "application/json";
        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        return headers;
    }

    private static async handleResponse<T>(response: Response, expectJson: boolean = true): Promise<T> {
        const obj = await response.json();

        if (!response.ok) {
            if (obj && obj.error)
                throw new Error(obj.error);
            else
                throw new Error(`Response ${response.status} - ${response.statusText}`);
        }

        if (!obj.data)
            return;
        else
            return obj.data as T;
    }
}