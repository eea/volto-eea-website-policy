import { runtimeConfig } from '@plone/volto/runtime_config';
import { appendGroup, getAsyncData } from './helpers';
import { FrequencyOfDissemination } from '@eeacms/volto-eea-website-policy/components/Widgets/FrequencyOfDissemination';
import ErrorView from '@eeacms/volto-eea-website-policy/components/ErrorView/ErrorView';

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
  // #160689 Redirect contact-form to contact-us
  config.settings.contactForm = '/en/about/contact-us';

  if (__SERVER__) {
    const devsource = __DEVELOPMENT__
      ? ` http://localhost:${parseInt(process.env.PORT || '3000') + 1}`
      : '';
    config.settings.serverConfig.csp = {
      'script-src': `'self' {nonce}${devsource}`,
    };
  }

  // #293749 Language dropdown
  config.settings.hasLanguageDropdown = true;

  //This only works if the component is wrapped in ErrorBoundary from volto
  config.registerComponent({
    name: 'ErrorBoundary',
    component: ErrorView,
  });

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

  config.settings.supportedLanguages = config.settings.eea?.languages?.map(
    (item) => item.code,
  ) || ['en'];

  config.settings.navigationLanguage = 'en';

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
      menuItemColumns: ['three wide column', 'nine wide column'],
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
    '/en/ghg-knowledge-hub': {
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

  // Group block: Skip figure-metadata groups when counting characters
  if (config.blocks.blocksConfig.group) {
    config.blocks.blocksConfig.group.skipBlocksInGroups = [
      { className: 'figure-metadata' },
    ];
  }

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
