import { Topology } from './topology';
import { Container } from './container';
import { Framework } from './framework';
import { Instancer } from './instancer';
import { Validator } from './validator';
import { ExceptionFactory } from './exception';
import { ProviderChecker, ProviderFactory } from './provider';

import type { IFramework } from './types';

export class Athlete {
  public createFramework(): IFramework {
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
