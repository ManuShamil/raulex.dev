import { IRedisConnectionOptions, RedisConnection } from ".";

interface RedisKeyStorage {
    keyName: string,
    keyValue: number
}


interface IKeysRedisConnection {
    setKey( data: RedisKeyStorage ): Promise<RedisKeyStorage>
}

export class KeysRedisConnection extends RedisConnection implements IKeysRedisConnection {
    constructor( connectionOptions: IRedisConnectionOptions ) {
        super( connectionOptions  );
    }
    public setKey( data: RedisKeyStorage ): Promise<RedisKeyStorage> {
        return new Promise<RedisKeyStorage>( async resolve => {
            let keyName = data.keyName;
            let keyValue = data.keyValue;
            await this.client.set( keyName, keyValue );
            resolve( data )
        })
    }
    public getValue( keyName: string ): Promise<number> {
        return new Promise<number>( async resolve => {
            let key = await this.client.get( keyName )
            if ( !key ) throw new Error(`Key "${keyName}" not found`)
            resolve( Number.parseInt( key) )
        })
    }
    public incrementKey( keyName: string ): Promise<number> {
        return new Promise<number>( async resolve => {
            let value = await this.client.incr( keyName )
            resolve( value )
        })
    }
}
  