class ThreadRepository{
    async addThread(thread){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyThread(id){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    
    async getThreadDetail(id){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadRepository;