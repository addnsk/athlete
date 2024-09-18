import type {
  Constructor,
  ICommand,
  IExceptionFactory,
  IModule,
  IProvider,
  IValidator,
  Providers,
} from './types';

export class Validator implements IValidator {
  constructor(private readonly exceptionFactory: IExceptionFactory) {}

  public eachModuleHasKey(uses: Map<Constructor<IModule>, Constructor<IModule>[]>): void {
    for (const values of uses.values())
      for (const value of values) {
        if (uses.has(value)) continue;
        throw this.exceptionFactory.createMissingUseException(value.name);
      }
  }

  public eachCommandDependencyHasKey(
    executes: Map<Constructor<ICommand>, Constructor<IModule>[]>,
    store: Map<Constructor<IModule>, Constructor<IModule>[]>
  ): void {
    for (const values of executes.values())
      for (const value of values)
        if (!store.has(value)) throw this.exceptionFactory.createMissingUseException(value.name);
  }

  public eachEntityIsUnique(providers: Providers[]): void {
    const entities = new Map<unknown, string>();
    for (const exportedProviders of providers)
      for (const [providerName, provider] of Object.entries(exportedProviders)) {
        if (typeof provider.entity !== 'object') continue;
        if (entities.has(provider.entity)) {
          const originProviderName = entities.get(provider.entity) as string;
          throw this.exceptionFactory.createDuplicateEntityException(
            originProviderName,
            providerName
          );
        }
        entities.set(provider.entity, providerName);
      }
  }
}
