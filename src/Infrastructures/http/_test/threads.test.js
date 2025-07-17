const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        let accessToken = '';
        beforeAll(async () => {
            const server = await createServer(container);

            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            // get access token
            const authResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                },
            });
            const authResponseJson = JSON.parse(authResponse.payload);

            accessToken = authResponseJson.data.accessToken;
        })

        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'Dicoding Indonesia',
                body: 'Dicoding Indonesia adalah',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responJson.status).toEqual('success');
            expect(responJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responJson.status).toEqual('fail');
            expect(responJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');

        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 'Dicoding Indonesia',
                body: true,
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responJson.status).toEqual('fail');
            expect(responJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and return thread detail', async () => {
            // Arrange
            const id = 'thread-125'
            await UsersTableTestHelper.addUser({ username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id });
            await CommentsTableTestHelper.addComment({ thread_id: id });

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${id}`,
            });

            // Assert
            const responJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responJson.status).toEqual('success');
            expect(responJson.data.thread).toBeDefined();
            expect(responJson.data.thread.comments).toBeDefined();
        });
    });
});