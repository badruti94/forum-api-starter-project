const CommentRepository = require('../CommentRepository');

describe('CommentRepository repository', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const commentRepository = new CommentRepository();

        // Action and Assert
        await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.deleteComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.verifyComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.verifyUser({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.getCommentsByThreadId({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    });
});