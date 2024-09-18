const { Logger, Service, Controller, Server, messageText } = require('./e2e.mocks');

class LoggerModule {
  export(providerFactory) {
    const LOGGER_PROVIDER = providerFactory.createFactoryProvider(Logger);
    return { LOGGER_PROVIDER };
  }
}

class DuplicateLoggerModule {
  export(providerFactory) {
    const DUPLICATE_LOGGER_PROVIDER = providerFactory.createFactoryProvider(Logger);
    return { DUPLICATE_LOGGER_PROVIDER };
  }
}

class MessageModule {
  export(providerFactory) {
    const MESSAGE_PROVIDER = providerFactory.createInstanceProvider(messageText);
    return { MESSAGE_PROVIDER };
  }
}

class DuplicateMessageModule {
  export(providerFactory) {
    const DUBLICATE_MESSAGE_PROVIDER = providerFactory.createInstanceProvider(messageText);
    return { DUBLICATE_MESSAGE_PROVIDER };
  }
}

class ServiceModule {
  constructor(loggerModule, messageModule) {
    this.loggerModule = loggerModule;
    this.messageModule = messageModule;
  }

  export({ createProvider }) {
    const { LOGGER_PROVIDER } = this.loggerModule;
    const { MESSAGE_PROVIDER } = this.messageModule;
    const SERVICE_PROVIDER = createProvider(Service, [LOGGER_PROVIDER, MESSAGE_PROVIDER]);
    return { SERVICE_PROVIDER };
  }
}

class ControllerModule {
  constructor(serviceModule, loggerModule) {
    this.serviceModule = serviceModule;
    this.loggerModule = loggerModule;
  }

  export(providerFactory) {
    const CONTROLLER_PROVIDER = providerFactory.createProvider(Controller, [
      this.serviceModule.SERVICE_PROVIDER,
      this.loggerModule.LOGGER_PROVIDER,
    ]);
    return { CONTROLLER_PROVIDER };
  }
}

class ServerModule {
  constructor(controllerModule, loggerModule) {
    this.controllerModule = controllerModule;
    this.loggerModule = loggerModule;
  }

  export(providerFactory) {
    const SERVER_PROVIDER = providerFactory.createProvider(Server, [
      this.controllerModule.CONTROLLER_PROVIDER,
      this.loggerModule.LOGGER_PROVIDER,
    ]);
    return { SERVER_PROVIDER };
  }
}

module.exports = {
  LoggerModule,
  MessageModule,
  ServiceModule,
  ControllerModule,
  ServerModule,
  DuplicateLoggerModule,
  DuplicateMessageModule,
};
