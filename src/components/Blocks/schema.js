import { cloneDeep } from 'lodash';
import imageNarrowSVG from '@eeacms/volto-eea-website-policy/components/Blocks/icons/image-narrow.svg';
import imageFitSVG from '@plone/volto/icons/image-fit.svg';
import imageWideSVG from '@plone/volto/icons/image-wide.svg';
import imageFullSVG from '@plone/volto/icons/image-full.svg';

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
            fields: ['size', 'class'],
          },
        ],
        properties: {
          size: {
            widget: 'style_align',
            title: 'Section size',
            actions: Object.keys(ALIGN_INFO_MAP),
            actionsInfoMap: ALIGN_INFO_MAP,
          },
          class: {
            title: 'Css class',
            description: 'Css classname applied to wrapper element',
          },
        },
        required: [],
      },
    };
    return resSchema;
  }

  return schema;
};
