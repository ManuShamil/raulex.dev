import { IRedisConnectionOptions, RedisConnection, RedisConnectionType } from ".";
import { KeysRedisConnection } from "./keys";

interface IRequestsRedisConnection {
    createRequest(): Promise<RedisRequestStorage>
}

interface RedisRequestStorage {
    requestId: number
}

export class RequestsRedisConnection extends RedisConnection implements IRequestsRedisConnection {
    constructor( connectionOptions: IRedisConnectionOptions ) {
        super( connectionOptions  );
    }
    public createRequest(): Promise<RedisRequestStorage> {
        return new Promise<RedisRequestStorage>( async resolve => {
            let keysRedisConnection = this.connectionOptions.connectionPool.get<KeysRedisConnection>( RedisConnectionType.Keys )
            let newRequestId: number = await keysRedisConnection?.incrementKey( "requestId" ) as number;
            resolve( { requestId: newRequestId } )
        })
    }
}
  