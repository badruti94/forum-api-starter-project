class DetailThreadComment {
    constructor(payload) {
        const { id, username, date, content, is_delete = false } = payload;

        this._verifyPayload(payload);

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = !is_delete ? content : '**komentar telah dihapus**';
    }

    _verifyPayload({ id, username, date, content }) {
        if (!id || !username || !date || !content) {
            throw new Error('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string'){
            throw new Error('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailThreadComment;