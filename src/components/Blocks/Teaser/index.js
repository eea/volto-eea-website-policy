import TeaserCardTemplate from './Card';

export default (config) => {
  if (config.blocks.blocksConfig.teaser) {
    config.blocks.blocksConfig.teaser.variations = [
      ...(config.blocks.blocksConfig.teaser.variations || []),
      {
        id: 'card',
        isDefault: true,
        title: 'Card (top image)',
        template: TeaserCardTemplate,
      },
    ];
  }

  return config;
};
