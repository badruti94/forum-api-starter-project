const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        const {threadId : thread_id} = request.params;

        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const addedComment = await commentUseCase.addComment({
            ...request.payload,
            thread_id,
            owner,
        });

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request) {
        const { commentId: id, threadId: thread_id } = request.params;
        const { id: owner } = request.auth.credentials;

        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        
        await commentUseCase.deleteComment(id, thread_id, owner);

        return {
            status: 'success',
        };
    }
}

module.exports = CommentsHandler;