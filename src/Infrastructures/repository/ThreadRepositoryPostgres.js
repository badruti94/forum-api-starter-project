const DetailThread = require("../../Domains/threads/entities/DetailThread");
const NewThread = require("../../Domains/threads/entities/NewThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(thread) {
        const { title, body, owner } = thread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, date, owner],
        };
        const result = await this._pool.query(query);

        return new NewThread({ ...result.rows[0] });

    }

    async verifyThread(id){
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount){
            throw new Error('THREAD_REPOSITORY.NOT_FOUND');
        }
    }

    async getThreadDetail(id){
        const query = {
            text: `SELECT threads.*, users.username FROM threads
            JOIN users ON threads.owner = users.id
            WHERE threads.id = $1`,
            values: [id],
        };
        const thread = await this._pool.query(query);

        if (!thread.rowCount){
            throw new Error('THREAD_REPOSITORY.NOT_FOUND');
        }
        
        return new DetailThread({
            ...thread.rows[0],
            date : thread.rows[0].date.toISOString(),
        })
    }
}

module.exports = ThreadRepositoryPostgres;