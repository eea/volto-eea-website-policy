import React from 'react';
import { BodyClass } from '@plone/volto/helpers';
import { getVoltoStyles } from '../schema-utils';
import cx from 'classnames';

const LayoutSettingsView = (props) => {
  console.log('props', props);
  const classNames = getVoltoStyles(props.data);
  console.log('classNames', classNames);
  return <BodyClass className={cx(classNames)} />;
};

export default LayoutSettingsView;
