const { Topology } = require('./topology');
const { Container } = require('./container');
const { Framework } = require('./framework');
const { Instancer } = require('./instancer');
const { Validator } = require('./validator');
const { ExceptionFactory } = require('./exception');
const { ProviderFactory, ProviderChecker } = require('./provider');

class Athlete {
  createFramework() {
    const exceptionFactory = new ExceptionFactory();
    const validator = new Validator(exceptionFactory);
    const topology = new Topology(exceptionFactory);
    const providerFactory = new ProviderFactory();
    const providerChecker = new ProviderChecker();
    const instancer = new Instancer(topology, exceptionFactory, providerFactory, providerChecker);
    const container = new Container(instancer, validator, exceptionFactory);
    return new Framework(container);
  }
}

module.exports = { Athlete };
