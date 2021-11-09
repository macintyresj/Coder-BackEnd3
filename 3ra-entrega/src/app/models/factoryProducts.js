const { TIPO_PERSISTENCIA } = require('../../config/config');
const persistenciaFileSystem = require('./persistenciaProducts/fileSystem');
const persistenciaMongoDB = require('./persistenciaProducts/mongoDB');
const persistenciaMongoDB_DBaaS = require('./persistenciaProducts/mongoDB_DBaaS');

class FactoryProductsModel {

    static setPersistencia(tipo) {
        switch(tipo) {
            case 'fileSystem': return new persistenciaFileSystem();
            case 'MongoDB': return new persistenciaMongoDB();
            case 'MongoDB_DBaaS': return new persistenciaMongoDB_DBaaS();
        }
    }

}

module.exports = FactoryProductsModel.setPersistencia(TIPO_PERSISTENCIA)