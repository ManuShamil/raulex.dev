import { ParsedQs } from 'qs'

export interface IIncomingRequest<T> {
    gateway: string;
    route: string;
    method: string | 'POST' | 'GET' | 'PUT' | 'DELETE';
    queryParams: ParsedQs;
    body: T
}

export interface IForwardableRequest<T> extends IIncomingRequest<T> {
    requestId: number;
}

