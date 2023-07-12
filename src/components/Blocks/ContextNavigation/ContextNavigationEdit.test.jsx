import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ContextNavigationEdit from './ContextNavigationEdit';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/components', () => ({
  InlineForm: ({ onChangeField }) => (
    <div>
      <p>InlineForm</p>
      <input id="test" onChange={onChangeField} />
    </div>
  ),
  SidebarPortal: ({ children }) => (
    <div>
      <div>SidebarPortal</div>
      {children}
    </div>
  ),
}));

jest.mock('@plone/volto/components/theme/Navigation/ContextNavigation', () => {
  return {
    __esModule: true,
    default: ({ params }) => {
      return <div>ConnectedContextNavigation {params.root_path}</div>;
    },
  };
});

describe('ContextNavigationEdit', () => {
  it('renders corectly', () => {
    const history = createMemoryHistory();
    const { getByText, queryByText } = render(
      <Router history={history}>
        <ContextNavigationEdit />
      </Router>,
    );

    expect(getByText('Context navigation')).toBeInTheDocument();
    expect(getByText('ConnectedContextNavigation')).toBeInTheDocument();
    expect(queryByText('InlineForm')).toBeNull();
    expect(getByText('SidebarPortal')).toBeInTheDocument();
  });

  it('renders corectly', () => {
    const history = createMemoryHistory();
    const { container, getByText } = render(
      <Router history={history}>
        <ContextNavigationEdit selected={true} onChangeBlock={() => {}} />
      </Router>,
    );

    expect(getByText('Context navigation')).toBeInTheDocument();
    expect(getByText('ConnectedContextNavigation')).toBeInTheDocument();
    expect(getByText('InlineForm')).toBeInTheDocument();
    expect(getByText('SidebarPortal')).toBeInTheDocument();

    fireEvent.change(container.querySelector('#test'), {
      target: { value: 'test' },
    });
  });
});
