const loggerConsrtuctorFn = jest.fn();
const serviceConstructorFn = jest.fn();
const controllerConstructorFn = jest.fn();
const serverConstructorFn = jest.fn();

const loggerLogFn = jest.fn();
const serviceGetFn = jest.fn();
const controllerGetFn = jest.fn();
const serverStartFn = jest.fn();

const messageText = 'Hello world!';

class Logger {
  constructor() {
    loggerConsrtuctorFn();
  }
  log() {
    loggerLogFn();
  }
}

class Message {
  constructor(text) {
    this.text = text;
  }
}

class Service {
  constructor(logger, message) {
    this.logger = logger;
    this.message = message;
    serviceConstructorFn();
  }

  get() {
    serviceGetFn();
    this.logger.log();
    return this.message;
  }
}

class Controller {
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
    controllerConstructorFn();
  }

  get() {
    controllerGetFn();
    this.logger.log();
    return this.service.get();
  }
}

class Server {
  constructor(controller, logger) {
    this.controller = controller;
    this.logger = logger;
    serverConstructorFn();
  }

  start() {
    serverStartFn();
    this.logger.log();
    return this.controller.get();
  }
}

module.exports = {
  Logger,
  Message,
  Service,
  Controller,
  Server,
  loggerConsrtuctorFn,
  serviceConstructorFn,
  controllerConstructorFn,
  serverConstructorFn,
  loggerLogFn,
  serviceGetFn,
  controllerGetFn,
  serverStartFn,
  messageText,
};
