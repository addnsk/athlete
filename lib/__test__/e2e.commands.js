const { messageText } = require('./e2e.mocks');

const startFrameworkCommandFn = jest.fn();

class StartFrameworkCommand {
  execute() {
    startFrameworkCommandFn();
  }
}

class StartServerCommand {
  constructor(serverProviders) {
    this.serverProviders = serverProviders;
  }

  execute(container) {
    const server = container.getInstance(this.serverProviders.SERVER_PROVIDER);
    const text = server.start();
    if (text !== messageText) throw new Error(`server.start() returns not messageText`);
  }
}

class FactoryInstantiateCommand {
  constructor(loggerProviders) {
    this.loggerProviders = loggerProviders;
  }

  execute(container) {
    const logger = container.getInstance(this.loggerProviders.LOGGER_PROVIDER);
    if (!logger) throw new Error(`logger was not instantiated`);
  }
}

module.exports = {
  StartFrameworkCommand,
  StartServerCommand,
  FactoryInstantiateCommand,
  startFrameworkCommandFn,
};
