const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { id: owner } = request.auth.credentials;

        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const addedThread = await threadUseCase.addThread({
            ...request.payload,
            owner,
        });

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadDetailHandler(request){
        const {threadId : id} = request.params;

        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const thread = await threadUseCase.getThreadDetail(id);

        return ({
            status: 'success',
            data: {
                thread,
            },
        });
    }
}

module.exports = ThreadsHandler;