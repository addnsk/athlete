import type { Constructor, IExceptionFactory } from './types';

class CyclicDependencyException extends Error {
  constructor(set: Set<Constructor>) {
    const names = Array.from(set).map((constructor) => constructor.name);
    super(`Cyclic dependency detected between ${names.join(', ')}`);
  }
}

class MissingModuleException extends Error {
  constructor(name: string) {
    super(`Module ${name} not found`);
  }
}

class UnknownProviderException extends Error {
  constructor() {
    super(`Unknown provider found`);
  }
}

class MissingUseException extends Error {
  constructor(name: string) {
    super(`Module ${name} not used`);
  }
}

class DuplicateEntityException extends Error {
  constructor(originalProviderName: string, duplicateProviderName: string) {
    super(
      `Duplicate entity found in providers: ${originalProviderName} and ${duplicateProviderName}`
    );
  }
}

export class ExceptionFactory implements IExceptionFactory {
  public createDuplicateEntityException(
    originalProviderName: string,
    duplicateProviderName: string
  ): Error {
    return new DuplicateEntityException(originalProviderName, duplicateProviderName);
  }

  public createMissingUseException(name: string): Error {
    return new MissingUseException(name);
  }

  public createCyclicDependencyException(set: Set<Constructor>): Error {
    return new CyclicDependencyException(set);
  }

  public createMissingModuleException(name: string): Error {
    return new MissingModuleException(name);
  }

  public createUnknownProviderException(): Error {
    return new UnknownProviderException();
  }
}
