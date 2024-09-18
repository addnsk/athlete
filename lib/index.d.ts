type Constructor<T extends unknown = unknown, A extends any[] = any[]> = new (...args: A) => T;

type Providers = { [key: string]: IProvider };

type DependenciesAsConstructors<A extends any[]> = { [K in keyof A]: Constructor<A[K]> };

type ProvidersAsModules<A extends Providers[]> = { [K in keyof A]: IModule<A[K]> };

type DependenciesAsProviders<A extends unknown[]> = { [K in keyof A]: IProvider<A[K]> };

type ProvidersAsDependencies<A extends unknown[]> = { [K in keyof A]: IProvider<A[K]> };

interface IProvider<T extends unknown = unknown> {
  readonly entity: Constructor<T> | T;
  instantiate(getInstance: GetProviderFunction): T;
}

type GetProviderFunction = <T, A extends IProvider[]>(
  constructor: Constructor<T, A>,
  dependencies: ProvidersAsDependencies<A>
) => T;

interface IProviderFactory {
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

interface IModule<T extends Providers = Providers> {
  export(providerFactory: IProviderFactory): T;
}

interface ICommand {
  execute(container: IContainer): void;
}

interface IFramework {
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

interface IContainer {
  getState(): Map<Constructor<IModule<Providers>, Providers[]>, Providers>;
  getInstance<T>(provider: IProvider<T>): T;
}

interface IFramework {
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

export class Athlete {
  public createFramework(): IFramework;
}
