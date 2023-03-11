import { IRedisConnectionOptions, RedisConnection, RedisConnectionType } from ".";
import { KeysRedisConnection } from "./keys";

export interface RedisGatewayStorage {
    gatewayId: number
    mongoObjectId: number
}

interface IGatewayRedisConnection {
    addGateway(): Promise<RedisGatewayStorage>
}

export class GatewayRedisConnection extends RedisConnection implements IGatewayRedisConnection {
    constructor( connectionOptions: IRedisConnectionOptions ) {
        super( connectionOptions  );
    }
    public addGateway() {
        return new Promise<RedisGatewayStorage>( async resolve => {
            let keysRedisConnection = this.connectionOptions.connectionPool.get<KeysRedisConnection>( RedisConnectionType.Keys )
            let newGatewayId: number = await keysRedisConnection?.incrementKey( "gatewayId" ) as number;  
            let newGateway: RedisGatewayStorage = {
                gatewayId: newGatewayId,
                mongoObjectId: Math.random() //! TODO
            }
            this.client.SET( newGatewayId.toString(), JSON.stringify( newGateway ) )
            resolve( newGateway )
        })
    }
}
  