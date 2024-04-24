import { runtimeConfig } from '@plone/volto/runtime_config';
import installContextNavigationBlock from '@eeacms/volto-eea-website-policy/components/Blocks/ContextNavigation';
import { appendGroup } from './helpers';
import { FrequencyOfDissemination } from '@eeacms/volto-eea-website-policy/components/Widgets/FrequencyOfDissemination';
import Login from '@eeacms/volto-eea-website-policy/components/AzureLogin/Login.jsx';
import Logout from '@plone-collective/volto-authomatic/components/Logout/Logout.jsx';
import { Login as VoltoLogin } from '@plone/volto/components';

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
    /^(?!(#|\/en|\/login-authomatic|\/azure_login|\/fallback_login|\/static|\/controlpanel|\/cypress|\/login|\/logout|\/contact-form|\/passwordreset)).*$/;
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

  //Make azure login to be at route azure_login, and ldap login to be at /login

  config.addonRoutes = config.addonRoutes.filter(
    (route) =>
      !route.path.includes('/login') && !route.path.includes('/logout'),
  );

  config.addonRoutes.push(
    {
      path: '/azure_login',
      component: Login,
    },
    { path: '/**/azure_login', component: Login },
    { path: '/login', component: VoltoLogin },
    { path: '/**/login', component: VoltoLogin },
    { path: '/logout', component: Logout },
    { path: '/**/logout', component: Logout },
  );

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
