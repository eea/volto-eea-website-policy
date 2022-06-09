import codeSVG from '@plone/volto/icons/code.svg';
import ItemEdit from './Edit';
import ItemView from './View';
import { stylingSchema } from './schema';

export default (config) => {
  config.blocks.blocksConfig.item = {
    id: 'item',
    title: 'Item',
    icon: codeSVG,
    group: 'common',
    edit: ItemEdit,
    view: ItemView,
    blockHasOwnFocusManagement: true,
    stylesSchema: stylingSchema,
    enableStyling: true,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  config.settings.blocksWithFootnotesSupport = {
    ...(config.settings.blocksWithFootnotesSupport || {}),
    item: ['description'],
  };

  return config;
};
