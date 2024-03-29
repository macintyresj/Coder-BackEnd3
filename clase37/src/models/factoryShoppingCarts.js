const { TIPO_PERSISTENCIA } = require('../config/config');
const persistenciaFileSystem = require('./persistenciaShoppingCarts/fileSystem');
const persistenciaMongoDB = require('./persistenciaShoppingCarts/mongoDB');
const persistenciaMongoDB_DBaaS = require('./persistenciaShoppingCarts/mongoDB_DBaaS');

class FactoryShoppingCartsModel {

    static setPersistencia(tipo) {
        switch(tipo) {
            case 'fileSystem': return new persistenciaFileSystem();
            case 'MongoDB': return new persistenciaMongoDB();
            case 'MongoDB_DBaaS': return new persistenciaMongoDB_DBaaS();
        }
    }

}

module.exports = FactoryShoppingCartsModel.setPersistencia(TIPO_PERSISTENCIA)