import React from 'react';
import RichTextWidget from '@plone/volto-slate/widgets/RichTextWidget';

export const InstitutionalMandate = (props) => (
  <RichTextWidget {...props} readOnly={true} />
);
