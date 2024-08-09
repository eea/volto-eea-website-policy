import Accordion from './Accordion';
import Default from './Default';

const contextBlockVariations = [
  {
    id: 'default',
    title: 'Listing (default)',
    view: Default,
    isDefault: true,
  },
  {
    id: 'accordion',
    title: 'Accordion',
    view: Accordion,
    schemaEnhancer: ({ schema, formData }) => {
      const contentTypes = __CLIENT__ ? window.__data.types.types : [];
      const availableTypes = contentTypes.map((type) => [
        type.id,
        type.title || type.name,
      ]);
      schema.fieldsets[0].fields.push('portal_types');
      schema.properties.portal_types = {
        title: 'Display content types',
        description: 'Choose content types displayed as children',
        choices: availableTypes,
        isMulti: true,
      };
      return schema;
    },
  },
];

export default contextBlockVariations;
