import type {
  Constructor,
  ICommand,
  IInstancer,
  IModule,
  IProvider,
  Providers,
  ProvidersAsDependencies,
  ProvidersFromDependencies,
  IExceptionFactory,
  IProviderFactory,
  GetProviderFunction,
  InstantiateFunction,
  IProviderChecker,
  ITopology,
} from './types';

export class Instancer implements IInstancer {
  constructor(
    private readonly topology: ITopology,
    private readonly exceptionFactory: IExceptionFactory,
    private readonly providerfactory: IProviderFactory,
    private readonly providerChecker: IProviderChecker
  ) {}

  private resolveModuleDependencies<A extends Constructor<IModule, Providers[]>[]>(
    dependencies: A,
    store: Map<Constructor<IModule, Providers[]>, Providers>
  ): ProvidersFromDependencies<A> {
    const args = [] as ProvidersFromDependencies<A>;
    for (const dependency of dependencies) {
      const providers = store.get(dependency);
      if (!providers) throw this.exceptionFactory.createMissingModuleException(dependency.name);
      args.push(providers);
    }
    return args;
  }

  private resolveProviderDependencies(
    dependencies: IProvider[],
    getProvider: GetProviderFunction
  ): unknown[] {
    return dependencies.map((provider) => provider.instantiate(getProvider));
  }

  private getInstance<T extends IModule | ICommand, A extends unknown[]>(
    constructor: Constructor<T, A>,
    dependencies: Constructor<IModule<Providers>, Providers[]>[],
    store: Map<Constructor<IModule, Providers[]>, Providers>
  ): T {
    const args = this.resolveModuleDependencies(dependencies, store);
    return Reflect.construct(constructor, args);
  }

  private getProviderInstance = <T, A extends IProvider[]>(
    constructor: Constructor<T, A>,
    dependencies: ProvidersAsDependencies<A>
  ): T => {
    const args = this.resolveProviderDependencies(dependencies, this.getProviderInstance);
    return Reflect.construct(constructor, args);
  };

  public getModules(
    uses: Map<Constructor<IModule, Providers[]>, Constructor<IModule, Providers[]>[]>
  ): Map<Constructor<IModule, Providers[]>, Providers> {
    const sequence = this.topology.sort(uses);
    const modules = new Map<Constructor<IModule, Providers[]>, Providers>();
    for (const [constructor, dependencies] of sequence) {
      const module = this.getInstance(constructor, dependencies, modules);
      modules.set(constructor, module.export(this.providerfactory));
    }
    return modules;
  }

  public getCommands(
    executes: Map<Constructor<ICommand, Providers[]>, Constructor<IModule, Providers[]>[]>,
    modules: Map<Constructor<IModule, Providers[]>, Providers>
  ): Map<Constructor<ICommand, Providers[]>, ICommand> {
    const commands = new Map<Constructor<ICommand, Providers[]>, ICommand>();
    for (const [constructor, dependencies] of executes) {
      const command = this.getInstance(constructor, dependencies, modules);
      commands.set(constructor, command);
    }
    return commands;
  }

  public getProviders(modules: Map<Constructor<IModule, Providers[]>, Providers>): IProvider[] {
    const providers: IProvider[] = [];
    for (const exportedProviders of modules.values())
      providers.push(...Object.values(exportedProviders));
    return providers;
  }

  public getInstances(providers: IProvider[]): Map<IProvider, unknown> {
    const instances = new Map<IProvider, unknown>();
    for (const provider of providers) {
      if (this.providerChecker.isFactoryProvider(provider)) continue;
      const instance = provider.instantiate(this.getProviderInstance);
      instances.set(provider, instance);
    }
    return instances;
  }

  public getFactories(providers: IProvider[]): Map<IProvider, InstantiateFunction> {
    const factories = new Map<IProvider, InstantiateFunction>();
    for (const provider of providers) {
      if (this.providerChecker.isNotFactoryProvider(provider)) continue;
      factories.set(provider, () => provider.instantiate(this.getProviderInstance));
    }
    return factories;
  }
}
