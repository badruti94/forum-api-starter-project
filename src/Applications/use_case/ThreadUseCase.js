const Thread = require("../../Domains/threads/entities/Thread");

class ThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async addThread(payload) {
        const thread = new Thread(payload);
        
        return await this._threadRepository.addThread(thread);
    }

    async getThreadDetail(id){
        const thread = await this._threadRepository.getThreadDetail(id);
        thread.comments = await this._commentRepository.getCommentsByThreadId(id);

        return thread;
    }
}

module.exports = ThreadUseCase;