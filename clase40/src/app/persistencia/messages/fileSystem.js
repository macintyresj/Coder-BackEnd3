const fs = require('fs');

let instaciaFileSystem = null;

class FileSystem {

    constructor() {
        this.urlPath = 'src/dbFile/messages.txt';
        this.messageId = ++this.read().length;

        this.randomValue = Math.random(100);
    }

    printValue() {
        console.log(`Random Value Messages: ${this.randomValue}`);
    }

    static getInstance() {
        if (!instaciaFileSystem) {
            instaciaFileSystem = new FileSystem();
        }

        return instaciaFileSystem;
    } 

    create(message) {
        try {
            let messages = this.read();
            const newMessage = {
                id: this.messageId++,
                author: message.author,
                text: message.text,
                fyh: new Date().toLocaleString()
            }
            messages.push(newMessage);
            fs.writeFileSync(this.urlPath, JSON.stringify(messages, null, '\t'));
            return messages[messages.length - 1];
        } catch (error) {
            console.log(`Error de persistencia al guardar ${this.urlPath}: ${error.message}`);
        }
    }

    read() {
        try {
            const messages = fs.readFileSync(this.urlPath, 'utf-8');
            return messages ? JSON.parse(messages) : [];
        } catch (error) {
            console.log(`Error de persistencia al leer ${this.urlPath}: ${error.message}`);
        }
    }

    readId(id) {
        const messages = this.read();
        const message = messages.filter(e => e.id == id);
        return message[0];
    }

    update(id, data) {
        let messages = this.read();
        let message = messages.filter(p => p.id == id);
        if (message.length) {
            let messageUpdated = Object.assign(message[0], data);
            messageUpdated.timestamp = new Date().toLocaleString();
            fs.writeFileSync(this.urlPath, JSON.stringify(messages, null, '\t'));
            return messageUpdated;
        } else {
            return false;
        }
    }

    delete(id) {
        let messages = this.read();
        let index = messages.findIndex(p => p.id == id);
        if (index >= 0) {
            const messageDeleted = messages.splice(index, 1);
            fs.writeFileSync(this.urlPath, JSON.stringify(messages, null, '\t'));
            return messageDeleted;
        } else {
            return false;
        }
    }

    deleteAll() {
        fs.writeFileSync(this.urlPath, JSON.stringify([], null, '\t'));
    }

}

module.exports = FileSystem;