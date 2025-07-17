const CommentRepository = require("../../Domains/comments/CommentRepository");
const DetailThreadComment = require("../../Domains/comments/entities/DetailThreadComment");
const NewComment = require("../../Domains/comments/entities/NewComment");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(comment) {
        const { content, thread_id, owner } = comment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, false, date, thread_id, owner],
        };
        const result = await this._pool.query(query);
        return new NewComment({ ...result.rows[0] });
    }

    async deleteComment(id) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id',
            values: [id],
        };
        await this._pool.query(query);
    }

    async verifyComment(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('COMMENT_REPOSITORY.NOT_FOUND');
        }
    }

    async verifyUser(id, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        const commentOwner = result.rows[0].owner;
        if (commentOwner !== owner) {
            throw new Error('COMMENT.USER_DOES_NOT_MATCH');
        }
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT comments.*, users.username FROM comments
                JOIN users ON comments.owner = users.id
                WHERE comments.thread_id = $1
                ORDER BY comments.date ASC`,
            values: [threadId],
        };
        const result = await this._pool.query(query);

        return result.rows.map(row => new DetailThreadComment({
            ...row,
            date: row.date.toISOString(),
        }));
    }
}

module.exports = CommentRepositoryPostgres;