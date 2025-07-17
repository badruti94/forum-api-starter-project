const NewThread = require('../NewThread');

describe('a NewThread entities ', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'tes',
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: true,
            title: 123,
            owner: 100,
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    });

    it('should create  NewThread object correctly', () => {
        // Arrange 
        const payload = {
            id: 'thread-123',
            title: 'tes',
            owner: 'user-123',
        };

        // Action and Assert
        const thread = new NewThread(payload);
        expect(thread.id).toEqual(payload.id);
        expect(thread.title).toEqual(payload.title);
        expect(thread.owner).toEqual(payload.owner);
    });
});