const DetailThreadComment = require('../../comments/entities/DetailThreadComment');

class DetailThread {
    constructor(payload) {
        const { id, title, body, date, username, comments = [] } = payload;

        this._verifyPayload(payload);

        this.id = id;
        this.title = title;
        this.body = body;
        this.date = date;
        this.username = username;
        this.comments = comments.map(comment => new DetailThreadComment(comment));
    }

    _verifyPayload({ id, title, body, date, username, comments = [] }) {
        if (!id || !title || !body || !date || !username) {
            throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string' || typeof username !== 'string' || !Array.isArray(comments)) {
            throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        
        for(const comment of comments){
            if (typeof comment !== 'object') {
                throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
            }
        }
    }
}

module.exports = DetailThread;