import config from '@plone/volto/registry';
import { matchPath } from 'react-router';

const blacklistRoutes =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (typeof action === 'function') {
      return next(action);
    }

    switch (action.type) {
      case '@@router/LOCATION_CHANGE':
        const { pathname } = action.payload.location;
        const { externalRoutes = [] } = config.settings;

        const route = externalRoutes.find((route) =>
          matchPath(pathname, route.match),
        );

        if (!route) {
          return next(action);
        } else {
          // EEA Redirect to /en fixing too many relative ../
          if (
            pathname.indexOf('resolveuid') !== -1 &&
            pathname.indexOf('/en/') === -1
          ) {
            window.location.replace(
              pathname.replace('/resolveuid/', '/en/resolveuid/'),
            );
          }
          // EEA replace location only when route match doesn't come from a regex
          // to properly handle urls hitting notInEn regex
          if (!(route.match.path instanceof RegExp)) {
            window.location.replace(
              route.url ? route.url(action.payload) : pathname,
            );
          }
        }
        break;
      default:
        return next(action);
    }
  };

export default blacklistRoutes;

