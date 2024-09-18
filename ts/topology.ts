import type { Constructor, ITopology, IExceptionFactory } from './types';

export class Topology implements ITopology {
  constructor(private readonly exceptionFactory: IExceptionFactory) {}

  private visit(
    entity: Constructor,
    graph: Map<Constructor, Constructor[]>,
    sorted: Map<Constructor, Constructor[]>,
    visiting = new Set<Constructor>(),
    visited = new Set<Constructor>()
  ): void {
    if (visiting.has(entity)) throw this.exceptionFactory.createCyclicDependencyException(visiting);
    if (visited.has(entity)) return;
    visiting.add(entity);
    const dependencies = graph.get(entity) || [];
    for (const dependency of dependencies) this.visit(dependency, graph, sorted, visiting, visited);
    sorted.set(entity, dependencies);
    visited.add(entity), visiting.delete(entity);
  }

  public sort<T, A>(
    map: Map<Constructor<T>, Constructor<A>[]>
  ): Map<Constructor<T>, Constructor<A>[]> {
    const sorted = new Map<Constructor<T>, Constructor<A>[]>();
    for (const entity of map.keys()) this.visit(entity, map, sorted);
    return sorted;
  }
}
