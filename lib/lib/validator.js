class Validator {
  constructor(exceptionFactory) {
    this.exceptionFactory = exceptionFactory;
  }

  eachModuleHasKey(uses) {
    for (const values of uses.values())
      for (const value of values) {
        if (uses.has(value)) continue;
        throw this.exceptionFactory.createMissingUseException(value.name);
      }
  }

  eachCommandDependencyHasKey(executes, store) {
    for (const values of executes.values())
      for (const value of values)
        if (!store.has(value)) throw this.exceptionFactory.createMissingUseException(value.name);
  }

  eachEntityIsUnique(providers) {
    const entities = new Map();
    for (const exportedProviders of providers)
      for (const [providerName, provider] of Object.entries(exportedProviders)) {
        if (typeof provider.entity !== 'object' && typeof provider.entity !== 'function') continue;
        if (entities.has(provider.entity)) {
          const originProviderName = entities.get(provider.entity);
          throw this.exceptionFactory.createDuplicateEntityException(
            originProviderName,
            providerName
          );
        }
        entities.set(provider.entity, providerName);
      }
  }
}

module.exports = { Validator };
