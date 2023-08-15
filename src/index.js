import { runtimeConfig } from '@plone/volto/runtime_config';
import installContextNavigationBlock from '@eeacms/volto-eea-website-policy/components/Blocks/ContextNavigation';
import { appendGroup } from './helpers';
import { FrequencyOfDissemination } from '@eeacms/volto-eea-website-policy/components/Widgets/FrequencyOfDissemination';

const restrictedBlocks = [
  'imagecards',
  // TODO: use what is needed from volto-datablocks after clean-up
  'conditionalDataBlock',
  'countryFlag',
  'custom_connected_block',
  'data_connected_embed',
  'dataqueryfilter',
  'dottedTableChart',
  'simpleDataConnectedTable',
];

const overrideBlocks = {
  embed_tableau_visualization: {
    group: 'data_visualizations',
  },
  tableau_block: {
    group: 'data_visualizations',
  },
  embed_eea_map_block: {
    group: 'data_visualizations',
  },
  dataFigure: {
    group: 'data_visualizations',
  },
};

const applyConfig = (config) => {
  // #158717#note-25 any path that isn't static, en or controlpanel is treated as external
  const notInEN = /^(?!(#|\/en|\/static|\/controlpanel|\/cypress|\/login|\/logout|\/contact-form)).*$/;
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

  // Add groups
  config.blocks.groupBlocksOrder = appendGroup(
    config,
    'data_visualizations',
    'Data Visualizations (Beta)',
  );

  // Disable some blocks
  restrictedBlocks.forEach((block) => {
    if (config.blocks.blocksConfig[block]) {
      config.blocks.blocksConfig[block].restricted = true;
    }
  });

  // Override blocks config
  Object.keys(overrideBlocks).forEach((block) => {
    if (config.blocks.blocksConfig[block]) {
      config.blocks.blocksConfig[block] = {
        ...config.blocks.blocksConfig[block],
        ...overrideBlocks[block],
      };
    }
  });

  // Custom widgets
  config.widgets.views.id.frequency_of_dissemination = FrequencyOfDissemination;

  // Subsite
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
