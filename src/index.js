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
  config.settings.dateLocale = "en-gb";

  // #137187 Keycloak integration
  // config.settings.externalRoutes = [{ match: "/login" }, { match: "/logout" }];

  // TODO: Working-copy
  // config.settings.hasWorkingCopySupport = true;

  // TODO: Multi-lingual
  // config.settings.isMultilingual = true;
  // config.settings.defaultLanguage = 'en';
  // config.settings.supportedLanguages = [
  //   'en', // English
  //   'sq', // Albanian
  //   'bg', // Bulgarian
  //   'bs', // Bosnian
  //   'cs', // Czech
  //   'hr', // Croatian
  //   'da', // Danish
  //   'nl', // Dutch
  //   'el', // Greek
  //   'et', // Estonian
  //   'fi', // Finnish
  //   'fr', // French
  //   'de', // German
  //   'hu', // Hungarian
  //   'is', // Icelandic
  //   'it', // Italian
  //   'lv', // Latvian
  //   'lt', // Lithuanian
  //   'mk', // Macedonian
  //   'mt', // Maltese
  //   'no', // Norwegian
  //   'pl', // Polish
  //   'pt', // Portuguese
  //   'ro', // Romanian
  //   'sh', // Serbian
  //   'sk', // Slovak
  //   'sl', // Slovenian
  //   'es', // Spanish
  //   'sv', // Swedish
  //   'tr', // Turkish
  // ];
  return config;
};

export default applyConfig;
