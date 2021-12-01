
class MessageRepository {

    constructor(dao) {
        this.messageDao = dao; 
    }

    async list() {
        return await this.messageDao.read();
    };

    async save(message) {
        return await this.messageDao.create(message);
    };

    async deleteAll() {
        return await this.messageDao.deleteAll();
    }

}

module.exports = MessageRepository;