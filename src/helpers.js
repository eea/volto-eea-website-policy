import { isArray } from 'lodash';
import config from '@plone/volto/registry';
import { serializeNodes } from 'volto-slate/editor/render';

export const createSlateParagraph = (text) => {
  return isArray(text) ? text : config.settings.slate.defaultValue();
};

export const serializeText = (text) => {
  return isArray(text) ? serializeNodes(text) : text;
};
