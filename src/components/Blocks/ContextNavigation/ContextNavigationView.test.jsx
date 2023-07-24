import React from 'react';
import { render } from '@testing-library/react';
import ContextNavigationView from './ContextNavigationView';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/components/theme/Navigation/ContextNavigation', () => {
  return {
    __esModule: true,
    default: ({ params }) => {
      return <div>ConnectedContextNavigation {params.root_path}</div>;
    },
  };
});

describe('ContextNavigationView', () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
  });

  it('renders corectly', () => {
    const { container } = render(
      <Router history={history}>
        <ContextNavigationView />
      </Router>,
    );

    expect(container.firstChild).toHaveTextContent(
      'ConnectedContextNavigation',
    );
  });

  it('renders corectly', () => {
    const { container } = render(
      <Router history={history}>
        <ContextNavigationView
          data={{
            navProps: { root_path: 'https://localhost:3000/test' },
            root_node: [{ '@id': 'root_node' }],
          }}
        />
      </Router>,
    );
    expect(container.firstChild).toHaveTextContent(
      'ConnectedContextNavigation root_node',
    );
  });
});
