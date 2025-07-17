const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('comments endpoint', () => {
    let accessToken = '';
    let userId = '';

    beforeAll(async () => {
        const server = await createServer(container);

        // add user
        const userResponse = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            },
        });
        const userResponseJson = JSON.parse(userResponse.payload);

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
        await ThreadsTableTestHelper.addThread({ owner: userResponseJson.data.addedUser.id });
        userId = userResponseJson.data.addedUser.id;
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await pool.end();
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    describe('when POST /comments', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const threadId = 'thread-123';
            const requestPayload = {
                content: 'abc',
            };

            const server = await createServer(container);

            // Action 
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responJson.status).toEqual('success');
            expect(responJson.data.addedComment).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const threadId = 'thread-123';
            const requestPayload = {};

            const server = await createServer(container);

            // Action 
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responJson.status).toEqual('fail');
            expect(responJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification ', async () => {
            // Arrange
            const threadId = 'thread-123';
            const requestPayload = {
                content: 123,
            };

            const server = await createServer(container);

            // Action 
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responJson.status).toEqual('fail');
            expect(responJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
        });

        it('should response 404 when thread id not found', async () => {
            // Arrange
            const threadId = 'thread-404';
            const requestPayload = {
                content: 'abc',
            };

            const server = await createServer(container);

            // Action 
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responJson.status).toEqual('fail');
            expect(responJson.message).toEqual('tidak dapat membuat comment baru karena thread tidak ditemukan');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and delete comment', async () => {
            // Arrange
            const id = 'comment-124';
            const thread_id = 'thread-123';

            await CommentsTableTestHelper.addComment({id, thread_id, owner: userId});
            
            const server = await createServer(container);

            // Action 
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${thread_id}/comments/${id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const comment = await CommentsTableTestHelper.findCommentById(id);
            const responJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responJson.status).toEqual('success');
            expect(comment[0].is_delete).toBeTruthy();
        });
    });
});