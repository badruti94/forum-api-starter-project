const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentUseCase = require('../CommentUseCase');

describe('CommentUseCase', () => {
    describe('addComment function', () => {
        it('should orchestrating the add comment action correctly', async () => {
            // Arrange
            const useCasePayload = {
                content: 'abc',
                thread_id: 'thread-123',
                owner: 'user-123',
            };

            const mockNewComment = new NewComment({
                id: 'comment-123',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            });

            const mockCommentRepository = new CommentRepository();
            const mockThreadRepository = new ThreadRepository();

            mockCommentRepository.addComment = jest.fn()
                .mockImplementation(() => Promise.resolve(mockNewComment));
            mockThreadRepository.verifyThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            const mockCommentUseCase = new CommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Action
            const newComment = await mockCommentUseCase.addComment(useCasePayload);

            // Assert
            expect(newComment).toStrictEqual(new NewComment({
                id: 'comment-123',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            }));
            expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new Comment({
                content: useCasePayload.content,
                thread_id: useCasePayload.thread_id,
                owner: useCasePayload.owner,
            }));
            expect(mockThreadRepository.verifyThread).toHaveBeenCalledWith(useCasePayload.thread_id);
        });
    });

    describe('deleteComment function', () => {
        it('should orchestrating the delete comment action correctly', async () => {
            // Arrange
            const thread_id = 'thread-123';
            const id = 'comment-123';
            const owner = 'user-123';

            const mockCommentRepository = new CommentRepository();
            const mockThreadRepository = new ThreadRepository();

            mockThreadRepository.verifyThread = jest.fn()
                .mockImplementation(() => Promise.resolve());
            mockCommentRepository.verifyComment = jest.fn()
                .mockImplementation(() => Promise.resolve());
            mockCommentRepository.verifyUser = jest.fn()
                .mockImplementation(() => Promise.resolve());
            mockCommentRepository.deleteComment = jest.fn()
                .mockImplementation(() => Promise.resolve());
            
            const mockCommentUseCase = new CommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Action
            await mockCommentUseCase.deleteComment(id, thread_id, owner);

            // Assert
            expect(mockThreadRepository.verifyThread).toHaveBeenCalledWith(thread_id);
            expect(mockCommentRepository.verifyComment).toHaveBeenCalledWith(id);
            expect(mockCommentRepository.verifyUser).toHaveBeenCalledWith(id, owner);
            expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(id);
        });
    });
});