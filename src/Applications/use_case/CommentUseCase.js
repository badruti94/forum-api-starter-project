const Comment = require("../../Domains/comments/entities/Comment");

class CommentUseCase{
    constructor({commentRepository, threadRepository}){
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async addComment(payload){
        const comment = new Comment(payload);

        await this._threadRepository.verifyThread(comment.thread_id);
        return await this._commentRepository.addComment(comment);
    }

    async deleteComment(id, thread_id, owner){
        await this._threadRepository.verifyThread(thread_id);
        await this._commentRepository.verifyComment(id);
        await this._commentRepository.verifyUser(id, owner);
        await this._commentRepository.deleteComment(id);
    }
}

module.exports = CommentUseCase;