export type Constructor<T extends unknown = unknown, A extends any[] = any[]> = new (
  ...args: A
) => T;

export type Providers = { [key: string]: IProvider };

export type DependenciesAsProviders<A extends unknown[]> = { [K in keyof A]: IProvider<A[K]> };

export interface IProvider<T extends unknown = unknown> {
  readonly entity: Constructor<T> | T;
  instantiate(getInstance: GetProviderFunction): T;
}

export interface IInstantiateStrategy<T> {
  instantiate<A extends any[]>(
    entity: Constructor<T, A> | T,
    dependencies: DependenciesAsProviders<A>,
    getProvider: GetProviderFunction
  ): T;
}

export interface IProviderFactory {
  createProvider<T>(entity: Constructor<T, []>): IProvider<T>;
  createProvider<T, A extends any[]>(
    entity: Constructor<T, A>,
    dependencies: DependenciesAsProviders<A>
  ): IProvider<T>;
  createFactoryProvider<T>(entity: Constructor<T, []>): IProvider<T>;
  createFactoryProvider<T, A extends any[]>(
    entity: Constructor<T, A>,
    dependencies: DependenciesAsProviders<A>
  ): IProvider<T>;
  createInstanceProvider<T>(entity: T): IProvider<T>;
}

export interface IProviderChecker {
  isFactoryProvider(candidate: unknown): boolean;
  isNotFactoryProvider(candidate: unknown): boolean;
}

export interface IModule<T extends Providers = Providers> {
  export(providerFactory: IProviderFactory): T;
}

export interface ICommand {
  execute(container: IContainer): void;
}

export type ProvidersFromDependencies<A extends Constructor<IModule<Providers>, Providers[]>[]> = {
  [K in keyof A]: ReturnType<InstanceType<A[K]>['export']>;
};

export type ProvidersAsDependencies<A extends unknown[]> = {
  [K in keyof A]: IProvider<A[K]>;
};

export type GetProviderFunction = <T, A extends IProvider[]>(
  constructor: Constructor<T, A>,
  dependencies: ProvidersAsDependencies<A>
) => T;

export type InstantiateFunction = () => unknown;

export interface IInstancer {
  getModules(
    uses: Map<Constructor<IModule, Providers[]>, Constructor<IModule, Providers[]>[]>
  ): Map<Constructor<IModule, Providers[]>, Providers>;
  getCommands(
    executes: Map<Constructor<ICommand, Providers[]>, Constructor<IModule, Providers[]>[]>,
    modules: Map<Constructor<IModule, Providers[]>, Providers>
  ): Map<Constructor<ICommand, Providers[]>, ICommand>;
  getProviders(modules: Map<Constructor<IModule, Providers[]>, Providers>): IProvider[];
  getInstances(providers: IProvider[]): Map<IProvider, unknown>;
  getFactories(providers: IProvider[]): Map<IProvider, InstantiateFunction>;
}

export interface ITopology {
  sort<T, A>(map: Map<Constructor<T>, Constructor<A>[]>): Map<Constructor<T>, Constructor<A>[]>;
}

export interface IExceptionFactory {
  createDuplicateEntityException(
    originalProviderName: string,
    duplicateProviderName: string
  ): Error;
  createMissingUseException(name: string): Error;
  createCyclicDependencyException(set: Set<Constructor<unknown, any[]>>): Error;
  createMissingModuleException(name: string): Error;
  createUnknownProviderException(): Error;
}

export type DependenciesAsConstructors<T extends any[]> = {
  [K in keyof T]: Constructor<T[K]>;
};

export type ProvidersAsModules<A extends Providers[]> = {
  [K in keyof A]: IModule<A[K]>;
};

export interface IFramework {
  use<T extends IModule>(module: Constructor<T, []>): this;
  use<T extends IModule, A extends Providers[]>(
    module: Constructor<T, A>,
    dependencies: DependenciesAsConstructors<ProvidersAsModules<A>>
  ): this;
  execute<T extends ICommand>(command: Constructor<T, []>): this;
  execute<T extends ICommand, A extends Providers[]>(
    command: Constructor<T, A>,
    modules: DependenciesAsConstructors<ProvidersAsModules<A>>
  ): this;
  start(): void;
}

export interface IContainer {
  getState(): Map<Constructor<IModule<Providers>, Providers[]>, Providers>;
  getInstance<T>(provider: IProvider<T>): T;
}

export interface IBuildableContainer {
  build(
    uses: Map<Constructor<IModule>, Constructor<IModule>[]>,
    executes: Map<Constructor<ICommand>, Constructor<IModule>[]>
  ): void;
}

export interface IValidator {
  eachModuleHasKey(uses: Map<Constructor<IModule>, Constructor<IModule>[]>): void;
  eachCommandDependencyHasKey(
    executes: Map<Constructor<ICommand>, Constructor<IModule>[]>,
    store: Map<Constructor<IModule>, Constructor<IModule>[]>
  ): void;
  eachEntityIsUnique(providers: Providers[]): void;
}
