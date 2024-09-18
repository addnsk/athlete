class Framework {
  constructor(container) {
    this.container = container;
    this.uses = new Map();
    this.executes = new Map();
  }

  use(module, dependencies = []) {
    this.uses.set(module, dependencies);
    return this;
  }

  execute(command, modules = []) {
    this.executes.set(command, modules);
    return this;
  }

  start() {
    this.container.build(this.uses, this.executes);
  }
}

module.exports = { Framework };
