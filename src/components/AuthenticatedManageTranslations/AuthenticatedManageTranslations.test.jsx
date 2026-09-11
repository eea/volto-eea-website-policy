import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { Router, StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import ManageTranslations from '@plone/volto/components/manage/Multilingual/ManageTranslations';
import AuthenticatedManageTranslations from './AuthenticatedManageTranslations';
import routes from '../../routes';

jest.mock(
  '@plone/volto/components/manage/Multilingual/ManageTranslations',
  () => {
    return jest.fn(() => <div>Translation management</div>);
  },
);

const mockStore = configureStore();
const url = '/en/about/manage-translations?language=ro#translations';
const loginUrl = `/login?return_url=${encodeURIComponent(url)}`;

beforeEach(() => {
  jest.clearAllMocks();
});

it('redirects anonymous server requests without rendering translation management', () => {
  const context = {};
  const html = renderToString(
    <Provider store={mockStore({ userSession: { token: null } })}>
      <StaticRouter location={url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>,
  );

  expect(context.url).toBe(loginUrl);
  expect(html).toBe('');
  expect(ManageTranslations).not.toHaveBeenCalled();
});

it('redirects anonymous client navigation to login with the return URL', () => {
  const history = createMemoryHistory({ initialEntries: [url] });
  render(
    <Provider store={mockStore({ userSession: { token: null } })}>
      <Router history={history}>{renderRoutes(routes)}</Router>
    </Provider>,
  );

  expect(history.location.pathname + history.location.search).toBe(loginUrl);
  expect(ManageTranslations).not.toHaveBeenCalled();
});

it('leaves nested login and create-translation routes to Volto', () => {
  expect(matchRoutes(routes, '/en/about/manage-translations/login')).toEqual(
    [],
  );
  expect(
    matchRoutes(routes, '/en/about/manage-translations/create-translation'),
  ).toEqual([]);
});

it('renders translation management for authenticated users and forwards route props', () => {
  const context = {};
  const routeProps = { match: { url: '/en/about/manage-translations' } };
  const html = renderToString(
    <Provider store={mockStore({ userSession: { token: 'session-token' } })}>
      <StaticRouter location={url} context={context}>
        <AuthenticatedManageTranslations {...routeProps} />
      </StaticRouter>
    </Provider>,
  );

  expect(context.url).toBeUndefined();
  expect(html).toContain('Translation management');
  expect(ManageTranslations.mock.calls[0][0]).toEqual(routeProps);
});
