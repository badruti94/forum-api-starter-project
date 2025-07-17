const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const Comment = require('../../../Domains/comments/entities/Comment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const DetailThreadComment = require('../../../Domains/comments/entities/DetailThreadComment');

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({});
    });
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist and return new comment correctyly', async () => {
            // Arrange
            const comment = new Comment({
                content: 'abc',
                thread_id: 'thread-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.addComment(comment);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(comments).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            // Arrange
            const comment = new Comment({
                content: 'abc',
                thread_id: 'thread-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const newComment = await commentRepositoryPostgres.addComment(comment);

            // Assert
            expect(newComment).toStrictEqual(new NewComment({
                id: 'comment-123',
                content: 'abc',
                owner: 'user-123',
            }));
        });
    });

    describe('deleteComment function', () => {
        it('should is_delete true', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({});
            const id = 'comment-123';

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.deleteComment(id);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentById(id);
            expect(comments[0].is_delete).toBeTruthy();
        });
    });

    describe('verifyComment', () => {
        it('should throw not found error', async () => {
            // Arrange
            const id = 'comment-404';
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyComment(id)).rejects.toThrowError('COMMENT_REPOSITORY.NOT_FOUND');
        });

        it('should not throw not found error', async () => {
            // Arrange
            const id = 'comment-123';
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await CommentsTableTestHelper.addComment({ id });

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyComment(id)).resolves.not.toThrowError('COMMENT_REPOSITORY.NOT_FOUND');
        });
    });

    describe('verifyUser function', () => {
        it('should throw error when user not match', async () => {
            // Arrange
            const id = 'comment-124';
            const owner = 'user-124';
            await CommentsTableTestHelper.addComment({ id });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Assert
            await expect(commentRepositoryPostgres.verifyUser(id, owner)).rejects.toThrowError('COMMENT.USER_DOES_NOT_MATCH');
        });

        it('should not throw error when user match', async () => {
            // Arrange
            const id = 'comment-124';
            const owner = 'user-123';
            await CommentsTableTestHelper.addComment({ id });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Assert
            await expect(commentRepositoryPostgres.verifyUser(id, owner)).resolves.not.toThrowError('COMMENT.USER_DOES_NOT_MATCH');
        });
    });

    describe('getCommentsByThreadId function', () => {
        it('should return comments by thread id correctly', async () => {
            // Arrange
            const threadId = 'thread-123';
            const date = '2025-07-15T00:00:00.000Z';
            const date2 = '2025-07-15T01:00:00.000Z';
            await CommentsTableTestHelper.addComment({ id: 'comment-125', date, });
            await CommentsTableTestHelper.addComment({ id: 'comment-126', content: 'abd', date : date2 });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

            // Assert
            expect(comments).toHaveLength(2);
            expect(comments[0]).toStrictEqual(new DetailThreadComment({
                id: 'comment-125',
                username: 'dicoding',
                date,
                content: 'abc',
            }));
            expect(comments[1]).toStrictEqual(new DetailThreadComment({
                id: 'comment-126',
                username: 'dicoding',
                date : date2,
                content: 'abd',
            }));

        });
    });
});