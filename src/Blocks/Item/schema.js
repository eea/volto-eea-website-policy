export default ({ data }) => {
  const { assetType = 'image' } = data;
  return {
    title: 'Item',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['assetType'],
      },
      ...(assetType === 'image'
        ? [{ id: 'image', title: 'Image', fields: ['image', 'imageSize'] }]
        : []),
      ...(assetType === 'icon'
        ? [{ id: 'icon', title: 'Icon', fields: ['icon', 'iconSize'] }]
        : []),
    ],
    properties: {
      assetType: {
        title: 'Asset type',
        choices: [
          ['image', 'Image'],
          ['icon', 'Icon'],
        ],
        default: 'image',
      },
      image: {
        title: 'Image',
        widget: 'attachedimage',
      },
      imageSize: {
        title: 'Image size',
        choices: [
          ['mini', 'Mini'],
          ['tile', 'Tile'],
          ['tiny', 'Tiny'],
          ['small', 'Small'],
          ['large', 'Large'],
          ['big', 'Big'],
          ['huge', 'Huge'],
          ['massive', 'Massive'],
        ],
        default: 'tile',
      },
      icon: {
        title: 'Icon name',
      },
      iconSize: {
        title: 'Icon size',
        choices: [
          ['mini', 'Mini'],
          ['tiny', 'Tiny'],
          ['small', 'Small'],
          ['large', 'Large'],
          ['big', 'Big'],
          ['huge', 'Huge'],
          ['massive', 'Massive'],
        ],
        default: 'huge',
      },
      iconTheme: {
        title: 'Icon theme',
        choices: [
          ['primary', 'Primary'],
          ['secondary', 'Secondary'],
        ],
      },
    },
    required: [],
  };
};

export const stylingSchema = ({ intl }) => ({
  title: 'Item style',
  block: 'item',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['theme', 'verticalAlign'],
    },
  ],
  properties: {
    theme: {
      title: 'Theme',
      choices: [
        ['primary', 'Primary'],
        ['secondary', 'Secondary'],
      ],
    },
    verticalAlign: {
      title: 'Vertical align',
      choices: [
        ['top', 'Top'],
        ['middle', 'Middle'],
        ['bottom', 'Bottom'],
      ],
    },
  },
  required: [],
});
