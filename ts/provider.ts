import type {
  Constructor,
  DependenciesAsProviders,
  GetProviderFunction,
  IInstantiateStrategy,
  IProvider,
  IProviderChecker,
  IProviderFactory,
} from './types';

class SingletonStrategy<T> implements IInstantiateStrategy<T> {
  private instance?: T;

  public instantiate<A extends any[]>(
    constructor: Constructor<T, A>,
    dependencies: DependenciesAsProviders<A>,
    getProvider: GetProviderFunction
  ): T {
    if (this.instance) return this.instance;
    this.instance = getProvider(constructor, dependencies);
    return this.instance;
  }
}

class FactoryStrategy<T> implements IInstantiateStrategy<T> {
  public instantiate<A extends any[]>(
    constructor: Constructor<T, A>,
    dependencies: DependenciesAsProviders<A>,
    getProvider: GetProviderFunction
  ): T {
    return getProvider(constructor, dependencies);
  }
}

class InstanceStratagy<T> implements IInstantiateStrategy<T> {
  public instantiate(entity: T): T {
    return entity;
  }
}

abstract class Provider<T, A extends any[]> implements IProvider<T> {
  constructor(
    private readonly strategy: IInstantiateStrategy<T>,
    public readonly entity: Constructor<T, A> | T,
    private readonly dependencies = [] as DependenciesAsProviders<A>
  ) {}

  public instantiate(getProvider: GetProviderFunction): T {
    return this.strategy.instantiate(this.entity, this.dependencies, getProvider);
  }
}

class SingletonProvider<T = unknown, A extends any[] = any[]> extends Provider<T, A> {
  constructor(entity: Constructor<T, A>, dependencies: DependenciesAsProviders<A>) {
    const strategy = new SingletonStrategy<T>();
    super(strategy, entity, dependencies);
  }
}

class FactoryProvider<T = unknown, A extends any[] = any[]> extends Provider<T, A> {
  constructor(entity: Constructor<T, A>, dependencies: DependenciesAsProviders<A>) {
    const strategy = new FactoryStrategy<T>();
    super(strategy, entity, dependencies);
  }
}

class InstanceProvider<T = unknown, A extends any[] = any[]> extends Provider<T, A> {
  constructor(entity: T) {
    const strategy = new InstanceStratagy<T>();
    super(strategy, entity);
  }
}

export class ProviderFactory implements IProviderFactory {
  public createProvider<T>(constructor: Constructor<T, []>): IProvider<T>;
  public createProvider<T, A extends any[]>(
    constructor: Constructor<T, A>,
    dependencies: DependenciesAsProviders<A>
  ): IProvider<T>;
  public createProvider<T, A extends any[]>(
    constructor: Constructor<T, A>,
    dependencies = [] as DependenciesAsProviders<A>
  ): IProvider<T> | IProvider<T> {
    return new SingletonProvider(constructor, dependencies);
  }

  public createFactoryProvider<T>(constructor: Constructor<T, []>): IProvider<T>;
  public createFactoryProvider<T, A extends any[]>(
    constructor: Constructor<T, A>,
    dependencies: DependenciesAsProviders<A>
  ): IProvider<T>;
  public createFactoryProvider<T, A extends any[]>(
    constructor: Constructor<T, A>,
    dependencies = [] as DependenciesAsProviders<A>
  ): IProvider<T> | IProvider<T> {
    return new FactoryProvider(constructor, dependencies);
  }

  public createInstanceProvider<T>(entity: T): IProvider<T> {
    return new InstanceProvider(entity);
  }
}

export class ProviderChecker implements IProviderChecker {
  public isFactoryProvider(candidate: unknown): boolean {
    return candidate instanceof FactoryProvider;
  }

  public isNotFactoryProvider(candidate: unknown): boolean {
    return !this.isFactoryProvider(candidate);
  }
}
