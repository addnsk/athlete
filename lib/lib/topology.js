class Topology {
  constructor(exceptionFactory) {
    this.exceptionFactory = exceptionFactory;
  }

  visit(entity, graph, sorted, visiting = new Set(), visited = new Set()) {
    if (visiting.has(entity)) throw this.exceptionFactory.createCyclicDependencyException(visiting);
    if (visited.has(entity)) return;
    visiting.add(entity);
    const dependencies = graph.get(entity) || [];
    for (const dependency of dependencies) this.visit(dependency, graph, sorted, visiting, visited);
    sorted.set(entity, dependencies);
    visited.add(entity), visiting.delete(entity);
  }

  sort(map) {
    const sorted = new Map();
    for (const entity of map.keys()) this.visit(entity, map, sorted);
    return sorted;
  }
}

module.exports = { Topology };
