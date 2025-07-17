const DetailThreadComment = require('../../../comments/entities/DetailThreadComment');
const DetailThread = require('../DetailThread');

describe('a DetailThread entity', () => {
    let payload = {};
    beforeAll(async () => {
        // Arrange
        payload = {
            id: "thread-h_2FkLZhtgBKY2kh4CC02",
            title: "sebuah thread",
            body: "sebuah body thread",
            date: "2021-08-08T07:19:09.775Z",
            username: "dicoding",
            comments: [],
        };
    });

    it('should create  DetailThread object correctly', () => {
        // Action and Assert
        const detailThread = new DetailThread(payload);

        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.date);
        expect(detailThread.username).toEqual(payload.username);
        expect(detailThread.comments).toEqual(payload.comments);
    });

    it('should create  DetailThread object with comments array length more than 1', () => {
        // Arrange
        const newPayload = {
            ...payload,
            comments: [new DetailThreadComment({
                id: 'comment-123',
                username: 'dicoding',
                date: "2021-08-08T07:22:33.555Z",
                content: 'abc',
                is_delete: false,
            })],
        };


        // Action and Assert
        const detailThread = new DetailThread(newPayload);

        expect(detailThread.comments).toHaveLength(1);
        expect(detailThread.comments[0].id).toEqual(newPayload.comments[0].id);
        expect(detailThread.comments[0].username).toEqual(newPayload.comments[0].username);
        expect(detailThread.comments[0].date).toEqual(newPayload.comments[0].date);
        expect(detailThread.comments[0].content).toEqual(newPayload.comments[0].content);
    });

    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
        };

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const newPayload = {
            ...payload,
            id: 100,
            title: 200,
            comments: 300,
        };

        // Action and Assert
        expect(() => new DetailThread(newPayload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when payload comment did not meet data type specification', () => {
        // Arrange
        const newPayload = {
            ...payload,
            comments: [400],
        };

        // Action and Assert
        expect(() => new DetailThread(newPayload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});