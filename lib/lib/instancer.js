class Instancer {
  constructor(topology, exceptionFactory, providerfactory, providerChecker) {
    this.topology = topology;
    this.exceptionFactory = exceptionFactory;
    this.providerfactory = providerfactory;
    this.providerChecker = providerChecker;
  }

  resolveModuleDependencies(dependencies, store) {
    const args = [];
    for (const dependency of dependencies) {
      const providers = store.get(dependency);
      if (!providers) throw this.exceptionFactory.createMissingModuleException(dependency.name);
      args.push(providers);
    }
    return args;
  }

  resolveProviderDependencies(dependencies, getProvider) {
    return dependencies.map((provider) => provider.instantiate(getProvider));
  }

  getInstance(constructor, dependencies, store) {
    const args = this.resolveModuleDependencies(dependencies, store);
    return Reflect.construct(constructor, args);
  }

  getProviderInstance = (constructor, dependencies) => {
    const args = this.resolveProviderDependencies(dependencies, this.getProviderInstance);
    return Reflect.construct(constructor, args);
  };

  getModules(uses) {
    const sequence = this.topology.sort(uses);
    const modules = new Map();
    for (const [constructor, dependencies] of sequence) {
      const module = this.getInstance(constructor, dependencies, modules);
      modules.set(constructor, module.export(this.providerfactory));
    }
    return modules;
  }

  getCommands(executes, modules) {
    const commands = new Map();
    for (const [constructor, dependencies] of executes) {
      const command = this.getInstance(constructor, dependencies, modules);
      commands.set(constructor, command);
    }
    return commands;
  }

  getProviders(modules) {
    const providers = [];
    for (const exportedProviders of modules.values())
      providers.push(...Object.values(exportedProviders));
    return providers;
  }

  getInstances(providers) {
    const instances = new Map();
    for (const provider of providers) {
      if (this.providerChecker.isFactoryProvider(provider)) continue;
      const instance = provider.instantiate(this.getProviderInstance);
      instances.set(provider, instance);
    }
    return instances;
  }

  getFactories(providers) {
    const factories = new Map();
    for (const provider of providers) {
      if (this.providerChecker.isNotFactoryProvider(provider)) continue;
      factories.set(provider, () => provider.instantiate(this.getProviderInstance));
    }
    return factories;
  }
}

module.exports = { Instancer };
