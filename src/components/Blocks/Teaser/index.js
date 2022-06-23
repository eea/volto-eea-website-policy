import CardTemplate from './Card';
import CardRoundedTemplate from './CardRounded';
import { StylingSchema } from './Schema';

export default (config) => {
  // Teaser
  if (config.blocks.blocksConfig.teaser) {
    config.blocks.blocksConfig.teaser.variations = [
      ...(config.blocks.blocksConfig.teaser.variations || []),
      {
        id: 'card',
        isDefault: true,
        title: 'Card',
        template: CardTemplate,
      },
      {
        id: 'cardRounded',
        isDefault: false,
        title: 'Card (Rounded)',
        template: CardRoundedTemplate,
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
