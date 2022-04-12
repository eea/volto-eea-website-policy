/**
 * View title block.
 * @module components/manage/Blocks/Title/View
 */

import { useMemo } from 'react';
import { isArray } from 'lodash';
import config from '@plone/volto/registry';
import {
  serializeNodes,
  serializeNodesToText,
} from 'volto-slate/editor/render';

export const serializeText = (text) => {
  return isArray(text) ? serializeNodes(text) : text;
};

const View = (props) => {
  const { properties, data } = props;

  const text = properties?.['description'] || '';
  const blockText = data?.text || config.settings.slate.defaultValue();
  const plainBlockText = useMemo(() => serializeNodesToText(blockText), [
    blockText,
  ]);

  const value = useMemo(() => {
    if (plainBlockText !== text) {
      return [
        {
          type: 'p',
          children: [{ text }],
        },
      ];
    }
    return blockText;
  }, [text, blockText, plainBlockText]);

  if (__SERVER__) return '';
  return serializeText(value);
};

export default View;
