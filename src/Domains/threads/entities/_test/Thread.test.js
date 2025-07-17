const Thread = require('../Thread')

describe('a Thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
        };

        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', async () => {
        // Arrange
        const payload = {
            title: true,
            body: true,
            owner: true,
        };

        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Thread object correctly', () => {
        // Arrange
        const payload = {
            title: 'dicoding',
            body: 'Dicoding Indonesia',
            owner: 'abc-123'
        };

        // Action
        const thread = new Thread(payload);

        // Assert
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
    });
});