const ThreadUseCase = require('../ThreadUseCase');
const Thread = require("../../../Domains/threads/entities/Thread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const NewThread = require('../../../Domains/threads/entities/NewThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadUseCase', () => {
    describe('addThread function', () => {
        it('should orchestrating the add thread action correctly', async () => {
            // Arrange
            const useCasePayload = {
                title: 'Dicoding Indonesia',
                body: 'Dicoding Indonesia adalah',
                owner: 'user-123',
            };

            const mockNewThread = new NewThread({
                id: 'thread-123',
                title: useCasePayload.title,
                owner: useCasePayload.owner,
            });

            const mockThreadRepository = new ThreadRepository();

            mockThreadRepository.addThread = jest.fn()
                .mockImplementation(() => Promise.resolve(mockNewThread));

            const mockThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
            });

            // Action
            const newThread = await mockThreadUseCase.addThread(useCasePayload);

            // Assert
            expect(newThread).toStrictEqual(new NewThread({
                id: 'thread-123',
                title: useCasePayload.title,
                owner: useCasePayload.owner,
            }));
            expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
                title: useCasePayload.title,
                body: useCasePayload.body,
                owner: useCasePayload.owner,
            }));

        });
    });

    describe('getThreadDetail function', () => {
        it('should orchestrating the get thread detail action correctly', async () => {
            // Arrange
            const id = 'thread-123';

            const mockThreadDetail = new DetailThread({
                id: 'thread-123',
                title: 'Dicoding Indonesia',
                body: 'Dicoding Indonesia adalah',
                date: '2025-07-15T00:00:00.000Z',
                username: 'dicoding',
                comments: [{
                    id: 'comment-123',
                    username: 'dicoding',
                    content: 'abc',
                    date: '2025-07-15T00:00:00.000Z',
                }],
            });

            const mockThreadRepository = new ThreadRepository();
            const mockCommentRepository = new CommentRepository();

            mockThreadRepository.getThreadDetail = jest.fn()
                .mockImplementation(() => Promise.resolve(mockThreadDetail));
            mockCommentRepository.getCommentsByThreadId = jest.fn()
                .mockImplementation(() => Promise.resolve(mockThreadDetail.comments))

            const mockThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
            });

            // Action
            const threadDetail = await mockThreadUseCase.getThreadDetail(id);

            // Assert
            expect(threadDetail).toStrictEqual(new DetailThread({
                id: 'thread-123',
                title: 'Dicoding Indonesia',
                body: 'Dicoding Indonesia adalah',
                username: 'dicoding',
                date: '2025-07-15T00:00:00.000Z',
                comments: [{
                    id: 'comment-123',
                    username: 'dicoding',
                    content: 'abc',
                    date: '2025-07-15T00:00:00.000Z',
                }],
            }))
            expect(mockThreadRepository.getThreadDetail).toHaveBeenCalledWith(id);
            expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(id);

        });
    });
});