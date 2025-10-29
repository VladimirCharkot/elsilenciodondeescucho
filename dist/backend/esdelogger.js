"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, label, printf } = winston_1.format;
const formato = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const myWinstonOptions = {
    level: 'debug',
    format: combine(timestamp(), formato),
    transports: [
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/todo.log' })
    ]
};
exports.logger = (0, winston_1.createLogger)(myWinstonOptions);
;
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }
exports.logger = exports.logger;
//# sourceMappingURL=esdelogger.js.map