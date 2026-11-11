import { vi } from 'vitest';
import '@testing-library/jest-dom';
import blacklistRoutes from './blacklistRoutes';
import config from '@plone/volto/registry';

vi.mock('@plone/volto/registry', () => ({
  default: { settings: { externalRoutes: [] } },
}));

const replace = vi.fn();

const locationChange = (pathname) => ({
  type: '@@router/LOCATION_CHANGE',
  payload: { location: { pathname } },
});

const run = (action) => {
  const next = vi.fn(() => 'next-result');
  const middleware = blacklistRoutes({
    dispatch: vi.fn(),
    getState: vi.fn(),
  })(next);
  return { next, result: middleware(action) };
};

beforeEach(() => {
  replace.mockReset();
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { replace },
  });
  config.settings.externalRoutes = [
    { match: { path: '/redirect', exact: true }, url: () => '/target' },
    { match: { path: '/no-url', exact: true } },
    { match: { path: /\/resolveuid\// } },
    { match: { path: /^\/en\/special/ } },
  ];
});

it('forwards thunk actions to next without redirecting', () => {
  const thunk = () => {};
  const { next, result } = run(thunk);

  expect(result).toBe('next-result');
  expect(next).toHaveBeenCalledWith(thunk);
  expect(replace).not.toHaveBeenCalled();
});

it('forwards unrelated actions to next', () => {
  const action = { type: 'SOME_OTHER_ACTION' };
  const { next } = run(action);

  expect(next).toHaveBeenCalledWith(action);
  expect(replace).not.toHaveBeenCalled();
});

it('forwards location changes that match no external route', () => {
  const action = locationChange('/no-match-here');
  const { next } = run(action);

  expect(next).toHaveBeenCalledWith(action);
  expect(replace).not.toHaveBeenCalled();
});

it('redirects to the route url for a matching string route', () => {
  const { next } = run(locationChange('/redirect'));

  expect(replace).toHaveBeenCalledWith('/target');
  expect(next).not.toHaveBeenCalled();
});

it('redirects to the pathname when a matching route has no url', () => {
  const { next } = run(locationChange('/no-url'));

  expect(replace).toHaveBeenCalledWith('/no-url');
  expect(next).not.toHaveBeenCalled();
});

it('rewrites resolveuid urls to the /en/ prefix', () => {
  const { next } = run(locationChange('/resolveuid/abc123'));

  expect(replace).toHaveBeenCalledTimes(1);
  expect(replace).toHaveBeenCalledWith('/en/resolveuid/abc123');
  expect(next).not.toHaveBeenCalled();
});

it('does not rewrite resolveuid urls that already contain /en/', () => {
  const { next } = run(locationChange('/en/resolveuid/abc123'));

  expect(replace).not.toHaveBeenCalled();
  expect(next).not.toHaveBeenCalled();
});

it('does not redirect when the matched route is a regular expression', () => {
  const { next } = run(locationChange('/en/special/page'));

  expect(replace).not.toHaveBeenCalled();
  expect(next).not.toHaveBeenCalled();
});
