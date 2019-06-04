"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../config.json');
const Mongo = require('mongodb-promises');
const debug = require('debug')('mongodb-provider');
class default_1 {
    constructor(collectionName) {
        let db = Mongo.db(config.mongodb.host, config.mongodb.database);
        this.collection = db.collection(collectionName);
        debug('%s - mongodb connection:%j', collectionName, config.mongodb);
    }
    findAll(selector, options) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('findAll selector:%j ,opt:%j', selector, options);
            return yield this.collection.findAll(selector, options || {});
        });
    }
    find(selector, options, sort, skip, limit) {
        return __awaiter(this, arguments, void 0, function* () {
            debug('find args:', arguments);
            return yield this.collection.find(selector, options, sort, Number(skip), Number(limit));
        });
    }
    findOne(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('findOne selector:', selector);
            return yield this.collection.findOne(selector);
        });
    }
    update(selector, update) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('update selector:%j,update:%j', selector, update);
            return yield this.collection.update(selector, update);
        });
    }
    updateAll(selector, update) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('update2 selector:%j,update:%j', selector, update);
            return yield this.collection.updateAll(selector, update);
        });
    }
    updateMany(selector, update) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('updateMany selector:%j,update:%j', selector, update);
            return yield this.collection.updateMulti(selector, update);
        });
    }
    upsert(selector, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('updateUpsert selector:%j,doc:%j', selector, doc);
            return yield this.collection.updateUpsert(selector, doc);
        });
    }
    insert(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('insert doc:%j', doc);
            return yield this.collection.insert(doc);
        });
    }
    remove(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('remove selector:%j', selector);
            return yield this.collection.remove(selector);
        });
    }
    count(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('count selector:%j', selector);
            return yield this.collection.count(selector);
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=provider.js.map