import { RedisConnectionPool } from "../pool"
import { RedisClientType } from '@redis/client'
import { createClient } from 'redis'

export enum RedisConnectionType {
    Keys = 0,
    Requests = 1,
    Gateways = 2,
}

export interface IRedisConnectionOptions {
    databaseIndex: RedisConnectionType
    connectionPool: RedisConnectionPool
}

export interface IRedisConnection {
    connectionOptions: IRedisConnectionOptions
    client: RedisClientType
}

export class RedisConnection implements IRedisConnection {
    connectionOptions: IRedisConnectionOptions
    client: RedisClientType
    private connected: boolean
    constructor( connectionOptions: IRedisConnectionOptions ) {
        this.connectionOptions = connectionOptions;
        this.client = createClient({
            url: this.connectionOptions.connectionPool.options.url,
            database: this.connectionOptions.databaseIndex
        })
        this.connected = false
    }
}