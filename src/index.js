import { runtimeConfig } from '@plone/volto/runtime_config';
import installCallout from 'volto-slate/editor/plugins/Callout';
import installItemBlock from '@eeacms/volto-eea-website-policy/Blocks/Item';

const applyConfig = (config) => {
  // if (process.env.NODE_ENV === 'production') {
  //   // Restrict block-style to Layout only
  //   config.settings.layoutOnlyBlockStyles = true;
  //   // Restrict slate metadata mentions to Layout only
  //   config.settings.layoutOnlySlateMetadataMentions = true;
  // }

  // Callout slate button
  config = installCallout(config);

  // Remove blockquote slate button
  config.settings.slate.toolbarButtons = config.settings.slate.toolbarButtons.filter(
    (item) => item !== 'blockquote',
  );

  // Disable tags on View
  config.settings.showTags = false;

  // Enable Title block
  config.blocks.blocksConfig.title.restricted = false;

  // Enable description block (also for cypress)
  config.blocks.blocksConfig.description.restricted = false;
  config.blocks.requiredBlocks = [];

  // Date format for EU
  config.settings.dateLocale = 'en-gb';

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
  config.settings.supportedLanguages = config.settings.eea?.languages?.map(
    (item) => item.code,
  ) || ['en'];

  // Done
  return [installItemBlock].reduce((acc, apply) => apply(acc), config);
};

export default applyConfig;
