/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123', content = 'abc', thread_id = 'thread-123', owner = 'user-123', date = new Date().toISOString(),
    }) {
        // const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, false, date, thread_id, owner],
        };

        await pool.query(query);
    },

    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;