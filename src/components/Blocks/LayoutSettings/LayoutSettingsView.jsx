import React from 'react';
import { BodyClass } from '@plone/volto/helpers';
import { getVoltoStyles } from '../schema-utils';
import cx from 'classnames';

const LayoutSettingsView = (props) => {
  const classNames = React.useMemo(() => getVoltoStyles(props.data), [
    props.data,
  ]);
  return <BodyClass className={cx(classNames)} />;
};

export default LayoutSettingsView;
