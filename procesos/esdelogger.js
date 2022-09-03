const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const formato = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const myWinstonOptions = {
    level: 'debug',
    format: combine(
      timestamp(),
      formato
    ),
    transports: [
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/todo.log' })
    ]
}

let logger = new createLogger(myWinstonOptions);;

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }


exports.logger = logger
