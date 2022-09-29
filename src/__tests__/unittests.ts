import {HederaClientFacade} from '../clients/hederaClientFacade'
import {Greeter} from "../index";


test('My Greeter', () => {
  expect(Greeter('Carl')).toBe('Hello Carl');
});


test('Setup sender client without all parameters', () => {
  expect(
    () => {
      new HederaClientFacade('', '')
    }
  ).toThrow(Error);
});


test('Setup sender client with wrong network name', () => {
  expect(
    () => {
      new HederaClientFacade('ciccio', 'pasticcio', 'pluto')
    }
  ).toThrow(Error);
});

