import React from 'react';
import RichTextWidget from '@plone/volto-slate/widgets/RichTextWidget';

export const DataProvenance = (props) => (
  <RichTextWidget {...props} readOnly={true} />
);
