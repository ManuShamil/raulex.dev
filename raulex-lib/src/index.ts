import express, { Express } from 'express';
import { ParsedQs } from 'qs'

import { IIncomingRequest, IForwardableRequest } from './types'

export class IncomingRequest<T> implements IIncomingRequest<T> {
    gateway: string;
    route: string;
    method: string | 'POST' | 'GET' | 'PUT' | 'DELETE';
    queryParams: ParsedQs;
    body: T

    constructor( expressRequest: express.Request ) {
        this.gateway = expressRequest.hostname;
        this.route = expressRequest.path;
        this.method = expressRequest.method;
        this.queryParams = expressRequest.query;
        this.body = expressRequest.body;
    }

    public forwardRequest() {
        
    }

}

export class ForwardableRequest<T> extends IncomingRequest<T> {
    requestId: number;

    constructor( expressRequest: express.Request ) {
        super( expressRequest );
        this.requestId = Math.floor( Math.random() * 1000000 );
    }
}