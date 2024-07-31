import React from 'react';
import { injectIntl } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';
import { withBlockExtensions } from '@plone/volto/helpers';

const ContextNavigationView = (props) => {
  const { variation, data = {} } = props;
  const navProps = { ...data };
  const root_path = data?.root_node?.[0]?.['@id'];
  if (root_path) navProps['root_path'] = flattenToAppURL(root_path);
  const Renderer = variation?.view;
  delete navProps.variation;
  return (
    <>
      <Renderer params={navProps} />
    </>
  );
};

export default injectIntl(withBlockExtensions(ContextNavigationView));
