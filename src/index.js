const applyConfig = (config) => {
  // if (process.env.NODE_ENV === 'production') {
  //   // Restrict block-style to Layout only
  //   config.settings.layoutOnlyBlockStyles = true;
  //   // Restrict slate metadata mentions to Layout only
  //   config.settings.layoutOnlySlateMetadataMentions = true;
  // }

  // Disable tags on View
  config.settings.showTags = false;

  // Enable Title block
  config.blocks.blocksConfig.title.restricted = false;

  // Enable description block (also for cypress)
  config.blocks.blocksConfig.description.restricted = false;
  config.blocks.requiredBlocks = [];

  // Date format for EU
  config.settings.dateLocale = 'en-gb';

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
  return config;
};

export default applyConfig;
