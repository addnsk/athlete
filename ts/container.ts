import type {
  Constructor,
  IBuildableContainer,
  ICommand,
  IContainer,
  IExceptionFactory,
  IInstancer,
  IModule,
  IProvider,
  IValidator,
  InstantiateFunction,
  Providers,
} from './types';

export class Container implements IContainer, IBuildableContainer {
  constructor(
    private readonly instancer: IInstancer,
    private readonly validator: IValidator,
    private readonly exceptionFactory: IExceptionFactory
  ) {}

  private instances = new Map<IProvider, unknown>();
  private factories = new Map<IProvider, InstantiateFunction>();

  private modules = new Map<Constructor<IModule<Providers>, Providers[]>, Providers>();

  public getInstance = <T>(provider: IProvider<T>): T => {
    const instance = this.instances.get(provider);
    if (instance) return instance as T;
    const instantiate = this.factories.get(provider);
    if (instantiate) return instantiate() as T;
    throw this.exceptionFactory.createUnknownProviderException();
  };

  public getState = (): Map<Constructor<IModule<Providers>, Providers[]>, Providers> => {
    return this.modules;
  };

  public build(
    uses: Map<Constructor<IModule>, Constructor<IModule>[]>,
    executes: Map<Constructor<ICommand>, Constructor<IModule>[]>
  ): void {
    this.validator.eachModuleHasKey(uses);
    this.modules = this.instancer.getModules(uses);
    this.validator.eachCommandDependencyHasKey(executes, uses);
    this.validator.eachEntityIsUnique(Array.from(this.modules.values()));
    const providers = this.instancer.getProviders(this.modules);
    this.instances = this.instancer.getInstances(providers);
    this.factories = this.instancer.getFactories(providers);
    const commands = this.instancer.getCommands(executes, this.modules);
    for (const command of commands.values()) command.execute(this);
  }
}
