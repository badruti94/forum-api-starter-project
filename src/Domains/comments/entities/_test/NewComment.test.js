const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123'
        };
        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 100,
            owner: 200,
        };

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'abc',
            owner: 'user-123',
        };

        // Action
        const newComment = new NewComment(payload);

        // Assert
        expect(newComment.id).toEqual(payload.id);
        expect(newComment.content).toEqual(payload.content);
        expect(newComment.owner).toEqual(payload.owner);
    });
});