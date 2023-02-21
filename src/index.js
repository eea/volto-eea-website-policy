import { runtimeConfig } from '@plone/volto/runtime_config';
import installContextNavigationBlock from '@eeacms/volto-eea-website-policy/components/Blocks/ContextNavigation';
import installLayoutSettingsBlock from '@eeacms/volto-eea-website-policy/components/Blocks/LayoutSettings';
import { addStylingFieldsetSchemaEnhancer } from '@eeacms/volto-eea-website-policy/components/Blocks/schema';

const applyConfig = (config) => {
  // #158717#note-25 any path that isn't static, en or controlpanel is treated as external
  const notInEN = /^(?!.*(\/en|\/static|\/controlpanel|\/cypress|\/login|\/logout)).*$/;
  config.settings.externalRoutes = [
    ...(config.settings.externalRoutes || []),
    {
      match: {
        path: notInEN,
        exact: false,
        strict: false,
      },
    },
  ];

  // #137187 Keycloak integration
  if (runtimeConfig['RAZZLE_KEYCLOAK'] === 'Yes') {
    config.settings.externalRoutes = [
      ...(config.settings.externalRoutes || []),
      {
        match: {
          path: '/login',
          exact: true,
          strict: false,
        },
      },
      {
        match: {
          path: '/logout',
          exact: true,
          strict: false,
        },
      },
    ];
  }

  // Working-copy
  config.settings.hasWorkingCopySupport = true;

  // Multi-lingual
  config.settings.isMultilingual = true;
  config.settings.defaultLanguage =
    config.settings.eea?.defaultLanguage || 'en';
  config.settings.supportedLanguages = ['en'];
  // Disable languages #158616
  // config.settings.eea?.languages?.map(
  //   (item) => item.code,
  // ) || ['en'];

  // Logo URL
  if (config.settings.eea) {
    config.settings.eea.logoTargetUrl = '/en';
  }

  // Block chooser
  config.blocks.blocksConfig.image.mostUsed = false;
  config.blocks.blocksConfig.video.mostUsed = false;

  // Grid/Teaser block (kitconcept)
  if (config.blocks.blocksConfig.__grid) {
    config.blocks.blocksConfig.__grid.restricted = true;
  }
  if (config.blocks.blocksConfig.imagesGrid) {
    config.blocks.blocksConfig.imagesGrid.restricted = true;
  }
  if (config.blocks.blocksConfig.teaser) {
    config.blocks.blocksConfig.teaser.restricted = true;
  }

  // Divider
  if (config.blocks.blocksConfig.dividerBlock) {
    config.blocks.blocksConfig.dividerBlock.mostUsed = true;
  }

  // Call to Action
  if (config.blocks.blocksConfig.callToActionBlock) {
    config.blocks.blocksConfig.callToActionBlock.mostUsed = true;
  }

  // Group
  if (config.blocks.blocksConfig.group) {
    config.blocks.blocksConfig.group.schemaEnhancer = addStylingFieldsetSchemaEnhancer;
  }

  // Columns
  if (config.blocks.blocksConfig.columnsBlock) {
    config.blocks.blocksConfig.columnsBlock.mostUsed = true;
    config.blocks.blocksConfig.columnsBlock.schemaEnhancer = addStylingFieldsetSchemaEnhancer;
  }

  // Accordion
  if (config.blocks.blocksConfig.accordion) {
    config.blocks.blocksConfig.accordion.mostUsed = true;
  }

  // Listing
  if (config.blocks.blocksConfig.listing) {
    config.blocks.blocksConfig.listing.title = 'Listing (Content)';
    config.blocks.blocksConfig.listing.schemaEnhancer = addStylingFieldsetSchemaEnhancer;
  }

  // Custom blocks
  // context navigation
  config = [installContextNavigationBlock].reduce(
    (acc, apply) => apply(acc),
    config,
  );

  // layout settings
  config = [installLayoutSettingsBlock].reduce(
    (acc, apply) => apply(acc),
    config,
  );

  // Disable some blocks
  if (config.blocks.blocksConfig.imagecards) {
    config.blocks.blocksConfig.imagecards.restricted = true;
  }

  config.settings.apiExpanders = [
    ...config.settings.apiExpanders,
    {
      match: '',
      GET_CONTENT: ['subsite'],
    },
  ];

  // Done
  return config;
};

export default applyConfig;
