const DetailThreadComment = require('../DetailThreadComment')

describe('a DetailThreadComment entity', () => {
    let payload = {};
    beforeAll(() => {
        // Arrange
        payload = {
            id: 'comment-123',
            username: 'dicoding',
            date: "2021-08-08T07:22:33.555Z",
            content: 'abc',
            is_delete: false,
        };
    });



    it('should create DetailThreadComment object correctly', () => {
        // Action
        const comment = new DetailThreadComment(payload);

        // Assert
        expect(comment.id).toEqual(payload.id);
        expect(comment.username).toEqual(payload.username);
        expect(comment.date).toEqual(payload.date);
        expect(comment.content).toEqual(payload.content);
        
    });
    it('should create DetailThreadComment with is_delete true object correctly', () => {
        // Arrange
        payload.is_delete = true;

        // Action
        const comment = new DetailThreadComment(payload);

        // Assert
        expect(comment.id).toEqual(payload.id);
        expect(comment.username).toEqual(payload.username);
        expect(comment.date).toEqual(payload.date);
        expect(comment.content).toEqual('**komentar telah dihapus**');
    });
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123'
        };

        // Action and Assert
        expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification',  () => {
        // Arrange
        payload.username = 123;
        payload.content = 100;

        // Action and Assert
        expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});