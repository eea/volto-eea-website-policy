import { cloneDeep } from 'lodash';
import imageNarrowSVG from '@eeacms/volto-eea-website-policy/components/Blocks/icons/image-narrow.svg';
import imageFitSVG from '@plone/volto/icons/image-fit.svg';
import imageWideSVG from '@plone/volto/icons/image-wide.svg';
import imageFullSVG from '@plone/volto/icons/image-full.svg';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Items: {
    id: 'Add Item',
    defaultMessage: 'Add Item',
  },
});

export const ALIGN_INFO_MAP = {
  narrow_width: [imageNarrowSVG, 'Narrow width'],
  container_width: [imageFitSVG, 'Container width'],
  wide_width: [imageWideSVG, 'Wide width'],
  full: [imageFullSVG, 'Full width'],
};

export const addStylingFieldsetSchemaEnhancer = ({ schema }) => {
  const applied = schema?.properties?.styles;

  if (!applied) {
    const resSchema = cloneDeep(schema);

    resSchema.fieldsets.push({
      id: 'styling',
      fields: ['styles'],
      title: 'Styling',
    });
    resSchema.properties.styles = {
      widget: 'object',
      title: 'Styling',
      schema: {
        fieldsets: [
          {
            id: 'default',
            title: 'Default',
            fields: ['size'],
          },
        ],
        properties: {
          size: {
            widget: 'style_align',
            title: 'Section size',
            actions: Object.keys(ALIGN_INFO_MAP),
            actionsInfoMap: ALIGN_INFO_MAP,
          },
        },
        required: [],
      },
    };
    return resSchema;
  }

  return schema;
};

export const ItemSchema = {
  title: 'Item',
  fieldsets: [
    {
      id: 'item',
      title: 'Item',
      fields: ['item_title'],
    },
  ],
  properties: {
    item_title: {
      title: 'Item title',
    },
  },
  required: [],
};
export const groupBlockSchemaEnhancer = (props) => {
  const {
    schema,
    intl,
    formData: { variation },
  } = props;
  const resSchema = cloneDeep(schema);
  if (variation === 'item group') {
    resSchema.fieldsets[0].fields.push('data');
    resSchema.properties.data = {
      title: intl.formatMessage(messages.Items),
      type: 'items',
      schema: ItemSchema,
      ...props.formData,
    };
    return resSchema;
  }
  return schema;
};
