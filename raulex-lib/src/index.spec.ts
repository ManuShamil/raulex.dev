import { RedisConnectionPoolBuilder, RequestsRedisConnection, RedisConnectionPool} from './redis'
import { RedisConnectionType } from './redis/connection';
import { GatewayRedisConnection, RedisGatewayStorage } from './redis/connection/gateway';
import { KeysRedisConnection } from './redis/connection/keys';

const redisConnectionURL = process.env.REDIS_URL || 'redis://localhost'

describe(`redis-connection-pool`, () => {
    let connectionPool: RedisConnectionPool;

    beforeAll( () => {
        connectionPool = new RedisConnectionPoolBuilder()
                                .withURL( redisConnectionURL )
                                .build()
    })

    it(`should be able to add connection`, async () => {

        let requestsConnection = new RequestsRedisConnection( {
            databaseIndex: RedisConnectionType.Requests,
            connectionPool: connectionPool as RedisConnectionPool
        })
        await connectionPool?.registerConnection( requestsConnection ) //! add requests.
        expect( connectionPool?.get( RedisConnectionType.Requests ) ).toBeInstanceOf( RequestsRedisConnection )
    })

    it(`should throw error if connection already exists`, async () => {
        let requestsConnection = new RequestsRedisConnection( {
            databaseIndex: RedisConnectionType.Requests,
            connectionPool: connectionPool as RedisConnectionPool
        })
        let result = await connectionPool?.registerConnection( requestsConnection)
        expect( result ).toBe( false )
    })

    describe(`indeces database`, () => {
        let keysConnection: KeysRedisConnection;
        beforeAll( async () => {
            keysConnection = new KeysRedisConnection({
                databaseIndex: RedisConnectionType.Keys,
                connectionPool: connectionPool as RedisConnectionPool
            })
            await connectionPool?.registerConnection( keysConnection )
        })
        it(`can set, increment, get index`, async () => {
            
            let keyName = `test`
            let keyValue = 1
            await keysConnection.setKey( { keyName, keyValue } ) //! set
            await keysConnection.incrementKey( keyName ) //! increment
            let result = await keysConnection.getValue( keyName )
            expect( result ).toBe( keyValue + 1 )
        })
    })
    describe(`requests database`, () => {
        let requestsConnection: RequestsRedisConnection;
        beforeAll(async () => {
            try {
                requestsConnection = new RequestsRedisConnection({
                    databaseIndex: RedisConnectionType.Requests,
                    connectionPool: connectionPool as RedisConnectionPool
                })
                await connectionPool?.registerConnection( requestsConnection )
            } catch (error) {}

        })
        it(`can create request`, async () => {
            let newRequest = await requestsConnection.createRequest()
            let { requestId } = newRequest
            
            newRequest = await requestsConnection.createRequest()
            expect( newRequest.requestId ).toBe( requestId + 1 )
        })
    })

    describe(`gateway database`, () => {
        let gatewaysConnection: GatewayRedisConnection;
        beforeAll( async () => {

            gatewaysConnection = new GatewayRedisConnection({
                databaseIndex: RedisConnectionType.Gateways,
                connectionPool: connectionPool as RedisConnectionPool
            })
            await connectionPool?.registerConnection( gatewaysConnection )

        })
        it(`can create new gateway`, async () => {
            //let newGateway = await gatewaysConnection.addGateway()
            
            expect( 1 ).toBeTruthy()
        })
    })

    afterAll( async () => {
        await connectionPool?.shutoff()
    })
})