import TeaserCardTemplate from './Card';
import { StylingSchema } from './Schema';
import { UniversalCard } from '@eeacms/volto-listing-block';

export default (config) => {
  // Teaser
  if (config.blocks.blocksConfig.teaser) {
    config.blocks.blocksConfig.teaser.variations = [
      ...(config.blocks.blocksConfig.teaser.variations || []),
      {
        id: 'card',
        isDefault: true,
        title: 'Card (top image)',
        template: TeaserCardTemplate,
        schemaEnhancer: UniversalCard.schemaEnhancer,
      },
    ];
    config.blocks.blocksConfig.teaser.enableStyling = true;
    config.blocks.blocksConfig.teaser.stylesSchema = StylingSchema;
  }

  // Teaser Grid
  if (config.blocks.blocksConfig.teaserGrid) {
    config.blocks.blocksConfig.teaserGrid.title = 'Teaser (Cards)';
  }

  return config;
};
