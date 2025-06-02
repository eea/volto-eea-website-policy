import { isArray } from 'lodash';
import config from '@plone/volto/registry';
import { getContent } from '@plone/volto/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import { serializeNodes } from '@plone/volto-slate/editor/render';

export const createSlateParagraph = (text) => {
  return isArray(text) ? text : config.settings.slate.defaultValue();
};

export const serializeText = (text) => {
  return isArray(text) ? serializeNodes(text) : text;
};

export const appendGroup = (config, id, title) => {
  const groupExists =
    config.blocks.groupBlocksOrder.filter((group) => group.id === id).length >
    0;

  if (!groupExists) {
    config.blocks.groupBlocksOrder = [
      ...config.blocks.groupBlocksOrder,
      {
        id,
        title,
      },
    ];
  }

  return config.blocks.groupBlocksOrder;
};

export const getAsyncData = ({ dispatch, id, data, path }) => {
  const diffView = path.slice(path.lastIndexOf('/'), path.length) === '/diff';
  const url = flattenToAppURL(data.url || '');
  if (!url || !diffView) {
    return [Promise.resolve()];
  }
  return [dispatch(getContent(url, null, id))];
};
