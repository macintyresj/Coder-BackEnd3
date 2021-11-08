const mongoose = require('mongoose');
const { loggerInfo, loggerError } = require('../config/log4js')

class MongoDB {

    constructor(url) {
        this.url = url;

        this.msjConnect();
        this.msjError();
    }

    async connect() {
        const connection = await mongoose.connect(this.url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        return connection;
    }

    msjConnect() {
        mongoose.connection.on('connected', () => {
            loggerInfo.info('[Mongoose] - connected');
        });
        return false;
    }

    msjError() {
        mongoose.connection.on('error', (err) => {
            loggerError.error('[Mongoose] - error:', err.message);
        });
        return false;
    }

}

module.exports = MongoDB;