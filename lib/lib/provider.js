class SingletonStrategy {
  instantiate(constructor, dependencies, getProvider) {
    if (this.instance) return this.instance;
    this.instance = getProvider(constructor, dependencies);
    return this.instance;
  }
}

class FactoryStrategy {
  instantiate(constructor, dependencies, getProvider) {
    return getProvider(constructor, dependencies);
  }
}

class InstanceStratagy {
  instantiate(entity) {
    return entity;
  }
}

class Provider {
  constructor(strategy, entity, dependencies = []) {
    this.strategy = strategy;
    this.entity = entity;
    this.dependencies = dependencies;
  }

  instantiate(getProvider) {
    return this.strategy.instantiate(this.entity, this.dependencies, getProvider);
  }
}

class SingletonProvider extends Provider {
  constructor(entity, dependencies) {
    const strategy = new SingletonStrategy();
    super(strategy, entity, dependencies);
  }
}

class FactoryProvider extends Provider {
  constructor(entity, dependencies) {
    const strategy = new FactoryStrategy();
    super(strategy, entity, dependencies);
  }
}

class InstanceProvider extends Provider {
  constructor(entity) {
    const strategy = new InstanceStratagy();
    super(strategy, entity);
  }
}

class ProviderFactory {
  createProvider(constructor, dependencies = []) {
    return new SingletonProvider(constructor, dependencies);
  }

  createFactoryProvider(constructor, dependencies = []) {
    return new FactoryProvider(constructor, dependencies);
  }

  createInstanceProvider(entity) {
    return new InstanceProvider(entity);
  }
}

class ProviderChecker {
  isFactoryProvider(candidate) {
    return candidate instanceof FactoryProvider;
  }

  isNotFactoryProvider(candidate) {
    return !this.isFactoryProvider(candidate);
  }
}

module.exports = { ProviderFactory, ProviderChecker };
