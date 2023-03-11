import { RequestsRedisConnection } from "./connection/request";
import { IRedisConnection, RedisConnection, RedisConnectionType } from './connection'

interface IRedisConnectionPoolBuilderOptions {
    url: string
}

interface IRedisConnectionPoolOptions extends IRedisConnectionPoolBuilderOptions {}

export interface IRedisConnectionPool {
    connections: Map<number, IRedisConnection>
}

export class RedisConnectionPool implements IRedisConnectionPool {
    options: IRedisConnectionPoolOptions
    connections: Map<number, IRedisConnection>

    constructor( options: IRedisConnectionPoolOptions) {
        this.connections = new Map<number, IRedisConnection>();
        this.options = options;
    }

    private assertConnectionExists<T extends RedisConnection>( connection: T ) {
        if ( this.connections.has( connection.connectionOptions.databaseIndex ) )
            return true;

        return false;
    }

    public async registerConnection<T extends RedisConnection>( connection: T ) {
        return new Promise<boolean>( async resolve => {
            if ( this.assertConnectionExists( connection ) ) {
                resolve( false)
                return
            }
            await connection.client.connect()
            this.insert( connection )
            resolve( true )
        })

    }   

    private insert<T extends RedisConnection>( connection: T ) {
        this.connections.set( connection.connectionOptions.databaseIndex, connection )
    }

    public get<T extends RedisConnection>( database: RedisConnectionType ): T | undefined {
        let connectionObj = this.connections.get( database );
        if ( !connectionObj ) return undefined
        return connectionObj as T;
    }

    public async shutoff() {
        for ( const connection of this.connections.values() )
            await connection.client.disconnect()
    }
}


export class RedisConnectionPoolBuilder {
    private options: IRedisConnectionPoolBuilderOptions
    constructor() {
        this.options = {
            url: `redis://localhost`
        }
    }
    public withURL( url: string ) {
        this.options.url = url;
        return this;
    }
    public build() {
        let connectionPool = new RedisConnectionPool( this.options );
        return connectionPool
    }
}

