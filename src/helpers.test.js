import * as helpers from './helpers';
import config from '@plone/volto/registry';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import { isArray } from 'lodash';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/registry', () => ({
  settings: {
    slate: {
      defaultValue: jest.fn(),
    },
  },
  blocks: {
    groupBlocksOrder: [
      { id: 'group1', title: 'Group1' },
      { id: 'group2', title: 'Group2' },
    ],
  },
}));

jest.mock('@plone/volto-slate/editor/render', () => ({
  serializeNodes: jest.fn(),
}));

describe('createSlateParagraph', () => {
  it('should return default value when input is not an array', () => {
    const input = 'test';
    helpers.createSlateParagraph(input);
    expect(config.settings.slate.defaultValue).toHaveBeenCalledTimes(1);
  });

  it('should return input when input is an array', () => {
    const input = ['test'];
    const result = helpers.createSlateParagraph(input);
    expect(result).toBe(input);
  });
});

describe('serializeText', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the text when it is not an array', () => {
    const text = 'Hello, World!';

    expect(helpers.serializeText(text)).toEqual(text);
    expect(isArray(text)).toBe(false);
    expect(serializeNodes).not.toHaveBeenCalled();
  });

  it('should call serializeNodes when text is an array', () => {
    const text = ['Hello', 'World!'];

    helpers.serializeText(text);
    expect(isArray(text)).toBe(true);
    expect(serializeNodes).toHaveBeenCalledWith(text);
  });
});

describe('appendGroup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the text when it is not an array', () => {
    const id = 'group2';
    const title = 'Group2';
    const result = helpers.appendGroup(config, id, title);
    expect(result).toEqual([
      { id: 'group1', title: 'Group1' },
      { id: 'group2', title: 'Group2' },
    ]);
  });

  it('should return the text when it is not an array', () => {
    const id = 'group3';
    const title = 'Group3';
    const result = helpers.appendGroup(config, id, title);
    expect(result).toEqual([
      { id: 'group1', title: 'Group1' },
      { id: 'group2', title: 'Group2' },
      { id, title },
    ]);
  });
});
