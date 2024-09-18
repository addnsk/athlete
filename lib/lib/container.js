class Container {
  constructor(instancer, validator, exceptionFactory) {
    this.instancer = instancer;
    this.validator = validator;
    this.exceptionFactory = exceptionFactory;
    this.instances = new Map();
    this.factories = new Map();
    this.modules = new Map();
  }

  getState = () => {
    return this.modules;
  };

  getInstance = (provider) => {
    const instance = this.instances.get(provider);
    if (instance) return instance;
    const instantiate = this.factories.get(provider);
    if (instantiate) return instantiate();
    throw this.exceptionFactory.createUnknownProviderException();
  };

  build(uses, executes) {
    this.validator.eachModuleHasKey(uses);
    this.modules = this.instancer.getModules(uses);
    this.validator.eachCommandDependencyHasKey(executes, uses);
    this.validator.eachEntityIsUnique(Array.from(this.modules.values()));
    const providers = this.instancer.getProviders(this.modules);
    this.instances = this.instancer.getInstances(providers);
    this.factories = this.instancer.getFactories(providers);
    const commands = this.instancer.getCommands(executes, this.modules);
    for (const command of commands.values()) command.execute(this);
  }
}

module.exports = { Container };
