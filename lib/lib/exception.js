class CyclicDependencyException extends Error {
  constructor(set) {
    const names = Array.from(set).map((constructor) => constructor.name);
    super(`Cyclic dependency detected between ${names.join(', ')}`);
  }
}

class MissingModuleException extends Error {
  constructor(name) {
    super(`Module ${name} not found`);
  }
}

class UnknownProviderException extends Error {
  constructor() {
    super(`Unknown provider found`);
  }
}

class MissingUseException extends Error {
  constructor(name) {
    super(`Module ${name} not used`);
  }
}

class DuplicateEntityException extends Error {
  constructor(originalProviderName, duplicateProviderName) {
    super(
      `Duplicate entity found in providers: ${originalProviderName} and ${duplicateProviderName}`
    );
  }
}

class ExceptionFactory {
  createDuplicateEntityException(originalProviderName, duplicateProviderName) {
    return new DuplicateEntityException(originalProviderName, duplicateProviderName);
  }

  createMissingUseException(name) {
    return new MissingUseException(name);
  }

  createCyclicDependencyException(set) {
    return new CyclicDependencyException(set);
  }

  createMissingModuleException(name) {
    return new MissingModuleException(name);
  }

  createUnknownProviderException() {
    return new UnknownProviderException();
  }
}

module.exports = { ExceptionFactory };
