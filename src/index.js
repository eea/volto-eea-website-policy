import { runtimeConfig } from '@plone/volto/runtime_config';
import installContextNavigationBlock from '@eeacms/volto-eea-website-policy/components/Blocks/ContextNavigation';

const restrictedBlocks = [
  'imagecards',
  'embed_eea_tableau_block',
  'embed_eea_map_block',
  // TODO: use what is needed from volto-datablocks after clean-up
  'conditionalDataBlock',
  'countryFlag',
  'custom_connected_block',
  'data_connected_embed',
  'dataqueryfilter',
  'dottedTableChart',
  'simpleDataConnectedTable',
];

const applyConfig = (config) => {
  // #158717#note-25 any path that isn't static, en or controlpanel is treated as external
  const notInEN = /^(?!.*(#|\/en|\/static|\/controlpanel|\/cypress|\/login|\/logout|\/contact-form)).*$/;
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

  // #160689 Redirect contact-form to contact-us
  config.settings.contactForm = '/en/about/contact-us';

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

  // Custom blocks
  // context navigation
  config = [installContextNavigationBlock].reduce(
    (acc, apply) => apply(acc),
    config,
  );

  // Disable some blocks
  restrictedBlocks.forEach((block) => {
    if (config.blocks.blocksConfig[block]) {
      config.blocks.blocksConfig[block].restricted = true;
    }
  });

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
