import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // For simulating clicks
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // For creating a mock store
import Login from './Login';

const mockStore = configureStore();

describe('Login component', () => {
  it('renders correctly with loading state', () => {
    const store = mockStore({
      authOptions: { loading: true, options: [] },
    });

    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('dispatches listAuthOptions on mount', () => {
    const store = mockStore({});
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
  });

  it('calls onSelectProvider and dispatches authomaticRedirect on provider selection', () => {
    const store = mockStore({
      authOptions: {
        loading: false,
        options: [{ id: 'github', title: 'GitHub' }],
      },
    });

    const mockOnSelectProvider = jest.fn();
    const mockDispatch = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <LoginForm onSelectProvider={mockOnSelectProvider} />
      </Provider>,
    );

    userEvent.click(screen.getByRole('button', { name: /GitHub/i }));

    expect(mockOnSelectProvider).toHaveBeenCalledWith({
      id: 'github',
      title: 'GitHub',
    });
    expect(mockDispatch).toHaveBeenCalledWith(authomaticRedirect('github'));
  });

  it('redirects after a successful OAuth login', () => {
    const store = mockStore({
      // ... other necessary state
      authomaticRedirect: { next_url: '/dashboard', session: true },
    });

    // Mock window.location.href (Simplified for example)
    const mockLocation = { href: '' };
    jest
      .spyOn(window, 'location', 'get')
      .mockImplementation(() => mockLocation);

    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    // ... User clicks a provider (similar to the previous test)
    userEvent.click(screen.getByRole('button', { name: /GitHub/i }));

    // Assertion after simulated redirect
    expect(mockLocation.href).toBe('/dashboard');
  });
});
