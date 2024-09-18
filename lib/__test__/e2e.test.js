const { Athlete, ProviderFactory } = require('../index');
const {
  LoggerModule,
  MessageModule,
  ServerModule,
  ServiceModule,
  ControllerModule,
  DuplicateLoggerModule,
  DuplicateMessageModule,
} = require('./e2e.modules');
const {
  StartFrameworkCommand,
  StartServerCommand,
  FactoryInstantiateCommand,
  startFrameworkCommandFn,
} = require('./e2e.commands');
const {
  loggerConsrtuctorFn,
  serviceConstructorFn,
  controllerConstructorFn,
  serverConstructorFn,
  loggerLogFn,
  serviceGetFn,
  controllerGetFn,
  serverStartFn,
} = require('./e2e.mocks');

describe('Athlete Framework', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should the framework start', () => {
    const framework = new Athlete()
      .createFramework()
      .use(ControllerModule, [ServiceModule, LoggerModule])
      .use(LoggerModule)
      .use(ServiceModule, [LoggerModule, MessageModule])
      .use(MessageModule)
      .use(ServerModule, [ControllerModule, LoggerModule])
      .execute(StartFrameworkCommand)
      .execute(StartServerCommand, [ServerModule])
      .execute(FactoryInstantiateCommand, [LoggerModule]);

    expect(() => framework.start()).not.toThrow();

    expect(startFrameworkCommandFn).toHaveBeenCalledTimes(1);

    expect(loggerConsrtuctorFn).toHaveBeenCalledTimes(4);
    expect(serviceConstructorFn).toHaveBeenCalledTimes(1);
    expect(controllerConstructorFn).toHaveBeenCalledTimes(1);
    expect(serverConstructorFn).toHaveBeenCalledTimes(1);

    expect(loggerLogFn).toHaveBeenCalledTimes(3);
    expect(serviceGetFn).toHaveBeenCalledTimes(1);
    expect(controllerGetFn).toHaveBeenCalledTimes(1);
    expect(serverStartFn).toHaveBeenCalledTimes(1);
  });

  it('should the framework with shuffled order start', () => {
    const frameworkShuffled = new Athlete()
      .createFramework()
      .execute(StartFrameworkCommand)
      .use(ControllerModule, [ServiceModule, LoggerModule])
      .use(MessageModule)
      .use(ServiceModule, [LoggerModule, MessageModule])
      .execute(StartServerCommand, [ServerModule])
      .use(ServerModule, [ControllerModule, LoggerModule])
      .execute(FactoryInstantiateCommand, [LoggerModule])
      .use(LoggerModule);

    expect(() => frameworkShuffled.start()).not.toThrow();

    expect(startFrameworkCommandFn).toHaveBeenCalledTimes(1);

    expect(loggerConsrtuctorFn).toHaveBeenCalledTimes(4);
    expect(serviceConstructorFn).toHaveBeenCalledTimes(1);
    expect(controllerConstructorFn).toHaveBeenCalledTimes(1);
    expect(serverConstructorFn).toHaveBeenCalledTimes(1);

    expect(loggerLogFn).toHaveBeenCalledTimes(3);
    expect(serviceGetFn).toHaveBeenCalledTimes(1);
    expect(controllerGetFn).toHaveBeenCalledTimes(1);
    expect(serverStartFn).toHaveBeenCalledTimes(1);
  });

  it('should throw an error due to cyclic dependency', () => {
    const frameworkWithCyclicDependency = new Athlete()
      .createFramework()
      .use(LoggerModule, [ServiceModule])
      .use(ServiceModule, [LoggerModule]);

    expect(() => frameworkWithCyclicDependency.start()).toThrowError(
      'Cyclic dependency detected between LoggerModule, ServiceModule'
    );
  });

  it('should throw an error due to missing dependency', () => {
    const frameworkWithMissingModule = new Athlete()
      .createFramework()
      .use(ControllerModule, [ServiceModule, LoggerModule])
      .use(LoggerModule)
      .use(ServiceModule, [LoggerModule, MessageModule])
      .use(MessageModule)
      // .use(ServerModule, [ControllerModule, LoggerModule])
      .use(ServerModule, [ControllerModule])
      .execute(StartFrameworkCommand)
      .execute(StartServerCommand, [ServerModule])
      .execute(FactoryInstantiateCommand, [LoggerModule]);

    expect(() => frameworkWithMissingModule.start()).toThrowError(
      `Cannot read properties of undefined (reading 'LOGGER_PROVIDER')`
    );
  });

  it('should throw an error due to missing use', () => {
    const frameworkWithMissingModule = new Athlete()
      .createFramework()
      .use(ControllerModule, [ServiceModule, LoggerModule])
      // .use(LoggerModule)
      .use(ServiceModule, [LoggerModule, MessageModule])
      .use(MessageModule)
      .use(ServerModule, [ControllerModule, LoggerModule])
      .execute(StartFrameworkCommand)
      .execute(StartServerCommand, [ServerModule])
      .execute(FactoryInstantiateCommand, [LoggerModule]);

    expect(() => frameworkWithMissingModule.start()).toThrowError('Module LoggerModule not used');
  });

  it('should throw an error due to the entity has more than one provider', () => {
    const frameworkWithDuplicatedModules = new Athlete()
      .createFramework()
      .use(ControllerModule, [ServiceModule, LoggerModule])
      .use(LoggerModule)
      .use(ServiceModule, [LoggerModule, MessageModule])
      .use(MessageModule)
      .use(ServerModule, [ControllerModule, LoggerModule])
      .execute(StartFrameworkCommand)
      .execute(StartServerCommand, [ServerModule])
      .execute(FactoryInstantiateCommand, [LoggerModule])
      .use(DuplicateLoggerModule)
      .use(DuplicateMessageModule);

    expect(() => frameworkWithDuplicatedModules.start()).toThrowError(
      'Duplicate entity found in providers: LOGGER_PROVIDER and DUPLICATE_LOGGER_PROVIDER'
    );
  });
});
