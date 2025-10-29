"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lrange = exports.rpush = exports.exists = exports.decr = exports.incr = exports.set = exports.get = exports.client = void 0;
const util_1 = require("util");
const redis_1 = require("redis");
exports.client = (0, redis_1.createClient)();
exports.client.on('connect', () => {
    console.log('Redis conectado!');
});
exports.client.on('error', (err) => {
    console.error('Error conectando Redis:');
    console.error(err);
});
exports.client.connect();
exports.get = (0, util_1.promisify)(exports.client.get).bind(exports.client);
exports.set = (0, util_1.promisify)(exports.client.set).bind(exports.client);
exports.incr = (0, util_1.promisify)(exports.client.incr).bind(exports.client);
exports.decr = (0, util_1.promisify)(exports.client.decr).bind(exports.client);
exports.exists = (0, util_1.promisify)(exports.client.exists).bind(exports.client);
exports.rpush = (0, util_1.promisify)(exports.client.rPush).bind(exports.client);
exports.lrange = (0, util_1.promisify)(exports.client.lRange).bind(exports.client);
//# sourceMappingURL=redisclient.js.map