class CommentRepository{
    async addComment(comment){
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteComment(id){
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyComment(id){
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyUser(id, owner){
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getCommentsByThreadId(threadId){
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    
}

module.exports = CommentRepository;