import { runtimeConfig } from '@plone/volto/runtime_config';
import { appendGroup, getAsyncData } from './helpers';
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
  embed_visualization: {
    group: 'data_visualizations',
  },
  embed_tableau_visualization: {
    group: 'data_visualizations',
  },
  embed_maps: {
    group: 'data_visualizations',
  },
  embed_eea_map_block: {
    group: 'data_visualizations',
  },
  tableau_block: {
    group: 'data_visualizations',
    restricted: true,
  },
  dataFigure: {
    group: 'data_visualizations',
  },
};

const applyConfig = (config) => {
  // #158717#note-25 any path that isn't static, en or controlpanel is treated as external
  const notInEN =
    /^(?!(#|\/en|\/login-authomatic|\/personal-information|\/azure_login|\/fallback_login|\/static|\/controlpanel|\/cypress|\/login|\/logout|\/contact-form|\/passwordreset)).*$/;
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

  if (config.blocks.blocksConfig.embed_static_content) {
    //prepopulate data for SSR particularly for history diffs
    config.blocks.blocksConfig.embed_static_content.getAsyncData = getAsyncData;
  }

  if (config.blocks.blocksConfig.embed_content) {
    //prepopulate data for SSR particularly for history diffs
    config.blocks.blocksConfig.embed_content.getAsyncData = getAsyncData;
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
  // #268249 - only allow managers to change layout from more menu
  config.settings.eea = {
    ...config.settings.eea,
    rolesWhoCanChangeLayout: ['Manager'],
  };

  // mega menu layout settings
  config.settings.menuItemsLayouts = {
    '/en/topics': {
      menuItemChildrenListColumns: [1, 4],
      menuItemColumns: [
        'at-a-glance three wide column',
        'topics-right-column nine wide column',
      ],
      hideChildrenFromNavigation: false,
    },
    '/en/countries': {
      menuItemColumns: ['eight wide column', 'four wide column'],
      menuItemChildrenListColumns: [5, 2],
      appendExtraMenuItemsToLastColumn: true,
      hideChildrenFromNavigation: false,
    },
    '/en/about': {
      hideChildrenFromNavigation: false,
    },
    '/en/ghg-knowledge-hub/': {
      hideChildrenFromNavigation: false,
    },
    '/en/ghg-knowledge-hub/*': {
      hideChildrenFromNavigation: false,
    },
    // if you want to set default settings for all menu items that don't have a specific path
    // '*': {
    //   hideChildrenFromNavigation: false,
    // },
  };

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

  if (config.blocks.blocksConfig.contextNavigation) {
    config.blocks.blocksConfig.contextNavigation.restricted = false;
  }

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
