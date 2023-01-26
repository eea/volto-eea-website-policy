import { isArray } from 'lodash';
import config from '@plone/volto/registry';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import { UniversalLink } from '@plone/volto/components';
import linkSVG from '@plone/volto/icons/link.svg';

import './less/slate-anchors.less';

export const createSlateParagraph = (text) => {
  return isArray(text) ? text : config.settings.slate.defaultValue();
};

export const serializeText = (text) => {
  return isArray(text) ? serializeNodes(text) : text;
};

export const renderLinkElement = (tagName) => {
  function LinkElement({
    attributes,
    children,
    mode = 'edit',
    className = null,
  }) {
    const Tag = tagName;
    const id = attributes.id || '';

    return (
      <Tag {...attributes} className={className}>
        {mode === 'view' && id && (
          <UniversalLink
            className="anchor"
            aria-hidden="true"
            tabIndex={-1}
            href={`#${id}`}
          >
            <svg
              {...linkSVG.attributes}
              dangerouslySetInnerHTML={{ __html: linkSVG.content }}
              width="2em"
              height={null}
            ></svg>
          </UniversalLink>
        )}
        {children}
      </Tag>
    );
  }
  LinkElement.displayName = `${tagName}LinkElement`;
  return LinkElement;
};
