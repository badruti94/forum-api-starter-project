const Comment = require('../Comment')

describe('a Comment entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'abc',
        };

        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: true,
            thread_id: 1,
            owner: 2,
        };

        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Comment object correctly', () => {
        // Arrange
        const payload = {
            content: 'dicoding',
            thread_id: 'thread-123',
            owner: 'user-123'
        };
        // Action
        const comment = new Comment(payload);

        // Assert
        expect(comment.content).toEqual(payload.content);
        expect(comment.thread_id).toEqual(payload.thread_id);
        expect(comment.owner).toEqual(payload.owner);
    });
});