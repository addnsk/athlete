import type {
  Constructor,
  DependenciesAsConstructors,
  IBuildableContainer,
  ICommand,
  IFramework,
  IModule,
  Providers,
  ProvidersAsModules,
} from './types';

export class Framework implements IFramework {
  constructor(private readonly container: IBuildableContainer) {}

  private readonly uses = new Map<Constructor<IModule>, Constructor<IModule>[]>();
  private readonly executes = new Map<Constructor<ICommand>, Constructor<IModule>[]>();

  public use<T extends IModule>(module: Constructor<T, []>): this;
  public use<T extends IModule, A extends Providers[]>(
    module: Constructor<T, A>,
    dependencies: DependenciesAsConstructors<ProvidersAsModules<A>>
  ): this;
  public use<T extends IModule, A extends Providers[]>(
    module: Constructor<T, A>,
    dependencies = [] as DependenciesAsConstructors<ProvidersAsModules<A>>
  ): this {
    this.uses.set(module, dependencies);
    return this;
  }

  public execute<T extends ICommand>(command: Constructor<T, []>): this;
  public execute<T extends ICommand, A extends Providers[]>(
    command: Constructor<T, A>,
    modules: DependenciesAsConstructors<ProvidersAsModules<A>>
  ): this;
  public execute<T extends ICommand, A extends Providers[]>(
    command: Constructor<T, A>,
    modules = [] as DependenciesAsConstructors<ProvidersAsModules<A>>
  ): this {
    this.executes.set(command, modules);
    return this;
  }

  public start(): void {
    this.container.build(this.uses, this.executes);
  }
}
