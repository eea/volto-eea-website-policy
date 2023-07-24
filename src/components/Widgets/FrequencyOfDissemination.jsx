import React from 'react';
import cx from 'classnames';

export const FrequencyOfDissemination = ({ value, children, className }) => {
  if (!value) {
    return '';
  }

  const text = value > 1 ? `Every ${value} years` : 'Once a year';
  return (
    <span className={cx(className, 'text', 'widget')}>
      {children ? children(text) : text}
    </span>
  );
};
