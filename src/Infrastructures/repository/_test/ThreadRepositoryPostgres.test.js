const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const Thread = require('../../../Domains/threads/entities/Thread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'dicoding' });
    });
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist add thread and return new thread correctyly', async () => {
            // Arrange
            const thread = new Thread({
                title: 'Dicoding Indonesia',
                body: 'Dicoding Indonesia adalah',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(thread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const thread = new Thread({
                title: 'Dicoding Indonesia',
                body: 'Dicoding Indonesia adalah',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const newThread = await threadRepositoryPostgres.addThread(thread);

            // Assert
            expect(newThread).toStrictEqual(new NewThread({
                id: 'thread-123',
                title: 'Dicoding Indonesia',
                owner: 'user-123',
            }));
        });
    });

    describe('verifyThread function', () => {
        it('should throw not found error', async () => {
            // Arrange
            const id = 'thread-404'
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThread(id)).rejects.toThrowError('THREAD_REPOSITORY.NOT_FOUND');
        });
        it('should not throw not found error', async () => {
            // Arrange 
            const id = 'thread-124'
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // add thread
            await ThreadsTableTestHelper.addThread({ id });

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThread(id)).resolves.not.toThrowError('THREAD_REPOSITORY.NOT_FOUND');

        });
    });
    describe('getThreadDetail function', () => {
        it('should return thread detail correctly', async () => {
            // Arrange
            const id = 'thread-125';
            const date = '2025-07-15T00:00:00.000Z';

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // add thread
            await ThreadsTableTestHelper.addThread({ id, date });

            // Action
            const threadDetail = await threadRepositoryPostgres.getThreadDetail(id);

            // Assert
            expect(threadDetail).toStrictEqual(new DetailThread({
                id,
                title: 'Dicoding Indonesia',
                body: 'Dicoding Indonesia adalah',
                date,
                username: 'dicoding',
            }));
        });

        it('should throw not found error when given not correct thread id', async () => {
            // Arrange
            const id = 'thread-404'
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action and Assert
            await expect(threadRepositoryPostgres.getThreadDetail(id)).rejects.toThrowError('THREAD_REPOSITORY.NOT_FOUND');
        });
    });
});