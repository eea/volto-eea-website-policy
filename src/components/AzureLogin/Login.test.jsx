import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import { useLocation } from 'react-router-dom';
import { listAuthOptions } from '@plone-collective/volto-authomatic/actions';
import '@testing-library/jest-dom/extend-expect';

import Login from './Login';

const mockStore = configureStore();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.useFakeTimers();

describe('Login component', () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ pathname: '/azure_login' });
  });

  it('renders correctly with loading state', () => {
    const store = mockStore({
      authOptions: { loading: true, options: [] },
      authomaticRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      oidcRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      intl: {
        locale: 'en',
        messages: {},
        formatMessage: jest.fn(),
      },
    });

    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('dispatches listAuthOptions on mount', () => {
    const store = mockStore({
      authOptions: { loading: true, options: [] },
      authomaticRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      oidcRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      intl: {
        locale: 'en',
        messages: {},
        formatMessage: jest.fn(),
      },
    });
    const dispatch = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    expect(dispatch).toHaveBeenCalledWith(listAuthOptions());
  });

  it('renders providers from the store', () => {
    const store = mockStore({
      authOptions: {
        loading: false,
        options: [
          { id: 'facebook', title: 'Facebook' },
          { id: 'twitter', title: 'Twitter' },
        ],
      },
      authomaticRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      oidcRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      intl: {
        locale: 'en',
        messages: {},
        formatMessage: jest.fn(),
      },
    });

    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    // Assert that the provider buttons are present
    expect(
      screen.getByRole('button', { name: /Facebook/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Twitter/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Facebook/i }));
  });

  it('clicks on GitHub button for OAuth login', () => {
    useLocation.mockReturnValue({ pathname: '/login' });

    const store = mockStore({
      authOptions: {
        loading: false,
        options: [{ id: 'github', title: 'GitHub' }],
      },
      authomaticRedirect: { next_url: '/dashboard', session: true },
      oidcRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      intl: {
        locale: 'en',
        messages: {},
        formatMessage: jest.fn(),
      },
    });

    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /GitHub/i }));
  });

  it('renders correctly with loading state', () => {
    const store = mockStore({
      authOptions: {
        loading: true,
        options: [{ id: 'oidc', title: 'OIDC' }],
      },
      authomaticRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      oidcRedirect: {
        next_url: '/dashboard',
        session: true,
      },
      intl: {
        locale: 'en',
        messages: {},
        formatMessage: jest.fn(),
      },
    });

    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
    jest.advanceTimersByTime(500);
  });
});
