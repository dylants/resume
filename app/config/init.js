const logger = require('../lib/logger')();

module.exports = () => {
  // Ascii art, brought to you by: http://www.patorjk.com/software/taag/#p=display&f=Big&t=Resume
  // (done to show a break in the logs after a restart)
  logger.log("\n\n  _____                                \n |  __ \\                               \n | |__) |___  ___ _   _ _ __ ___   ___ \n |  _  // _ \\/ __| | | | '_ ` _ \\ / _ \\\n | | \\ \\  __/\\__ \\ |_| | | | | | |  __/\n |_|  \\_\\___||___/\\__,_|_| |_| |_|\\___|\n\n");

  if (process.env.NODE_ENV) {
    logger.log(`Application loaded using the ${process.env.NODE_ENV} environment`);
  } else {
    logger.error('NODE_ENV is not defined! Using default development environment');
    process.env.NODE_ENV = 'development';
  }
};
