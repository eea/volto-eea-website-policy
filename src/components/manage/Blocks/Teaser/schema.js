/**
 * Add an `External_link` field to the teaser block schema.
 *
 * When a teaser has this set, the Card template links to it instead of the
 * target content item (see TeaserCardExternalLink).
 */

export const EXTERNAL_LINK_FIELD = 'External_link';

export const addExternalLinkField = ({ schema }) => {
  const fieldset =
    schema.fieldsets.find(({ id }) => id === 'default') || schema.fieldsets[0];
  const { fields } = fieldset;

  if (!fields.includes(EXTERNAL_LINK_FIELD)) {
    const hrefIndex = fields.indexOf('href');
    if (hrefIndex === -1) {
      fields.push(EXTERNAL_LINK_FIELD);
    } else {
      fields.splice(hrefIndex + 1, 0, EXTERNAL_LINK_FIELD);
    }
  }

  schema.properties[EXTERNAL_LINK_FIELD] = {
    title: 'External link',
    description:
      'When set, the teaser links here instead of the target content item.',
    widget: 'url',
  };

  return schema;
};
