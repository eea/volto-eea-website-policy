import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom';
import Edit from './Edit';

// The customization only ships the composed default export, so the
// lazy-library HOC is stubbed and the loaded prettier/prism libraries are
// passed straight through as props.
vi.mock('@plone/volto/helpers/Loadable/Loadable', () => ({
  injectLazyLibs: () => (WrappedComponent) => WrappedComponent,
  preloadLazyLibs: () => (WrappedComponent) => WrappedComponent,
}));

vi.mock('prismjs/components/prism-markup', () => ({}));

const mocks = vi.hoisted(() => ({
  input: { selectionStart: 2, selectionEnd: 4, focus: vi.fn() },
  editorProps: { current: null },
}));

// Replace the async-loaded code editor with a plain textarea so the component
// can be rendered synchronously while keeping the editor ref contract
// (`codeEditorRef.current._input`) that the selection logic relies on.
vi.mock('@loadable/component', async () => {
  const React = (await import('react')).default;
  const MockEditor = React.forwardRef((props, ref) => {
    mocks.editorProps.current = props;
    React.useImperativeHandle(ref, () => ({ _input: mocks.input }));
    return React.createElement('textarea', {
      'data-testid': 'code-editor',
      className: props.className,
      placeholder: props.placeholder,
      value: props.value,
      readOnly: props.readOnly,
      onChange: (event) => props.onValueChange(event.target.value),
    });
  });
  return { __esModule: true, default: () => MockEditor };
});

const format = vi.fn();
const prismCore = {
  highlight: vi.fn(() => 'highlighted'),
  languages: { html: {} },
};

const baseProps = {
  selected: false,
  block: 'block-1',
  index: 0,
  data: { html: '<h1>Hello</h1>' },
  onChangeBlock: vi.fn(),
  onSelectBlock: vi.fn(),
  onDeleteBlock: vi.fn(),
  handleKeyDown: vi.fn(),
  editable: true,
  prettierStandalone: { format },
  prettierParserHtml: {},
  prismCore,
};

const renderEdit = (props = {}) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <Edit {...baseProps} {...props} />
    </IntlProvider>,
  );

const waitForEditor = () => waitFor(() => screen.getByTestId('code-editor'));

beforeEach(() => {
  vi.clearAllMocks();
  format.mockReset();
  mocks.input.selectionStart = 2;
  mocks.input.selectionEnd = 4;
  mocks.editorProps.current = null;
});

describe('HTML block Edit customization', () => {
  it('renders the code editor with the block html and the default placeholder', async () => {
    renderEdit();
    const editor = await waitForEditor();

    expect(editor).toHaveValue('<h1>Hello</h1>');
    expect(editor).toHaveAttribute('placeholder', '<p>Add some HTML here</p>');
    expect(editor.readOnly).toBe(true);
    expect(screen.queryByRole('button', { name: 'Preview' })).toBeNull();
  });

  it('renders the preview toolbar when a selected block has a custom placeholder', async () => {
    renderEdit({
      selected: true,
      data: { html: '<p>x</p>', placeholder: 'Type here' },
    });
    const editor = await waitForEditor();

    expect(editor).toHaveAttribute('placeholder', 'Type here');
    expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument();
  });

  it('renders an empty editor and no toolbar when the block has no html', async () => {
    renderEdit({ selected: true, data: {} });
    const editor = await waitForEditor();

    expect(editor).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Preview' })).toBeNull();
  });

  it('calls onChangeBlock when the editor value changes', async () => {
    renderEdit();
    const editor = await waitForEditor();

    fireEvent.change(editor, { target: { value: '<p>changed</p>' } });

    expect(baseProps.onChangeBlock).toHaveBeenCalledWith('block-1', {
      html: '<p>changed</p>',
    });
  });

  it('prettifies and switches to preview when the preview button is clicked', async () => {
    format.mockResolvedValue('  <h1>Hello</h1>  ');
    renderEdit({ selected: true });
    await waitForEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    await waitFor(() =>
      expect(baseProps.onChangeBlock).toHaveBeenCalledWith('block-1', {
        html: '<h1>Hello</h1>',
      }),
    );
    expect(format).toHaveBeenCalledWith('<h1>Hello</h1>', {
      parser: 'html',
      plugins: [baseProps.prettierParserHtml],
    });
    expect(screen.queryByTestId('code-editor')).toBeNull();
  });

  it('restores the editor selection and focus after an update of a selected block', async () => {
    format.mockResolvedValue('<h1>Hello</h1>');
    renderEdit({ selected: true });
    await waitForEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    await waitFor(() => expect(mocks.input.focus).toHaveBeenCalled());
    expect(mocks.input.selectionStart).toBe(2);
    expect(mocks.input.selectionEnd).toBe(4);
  });

  it('keeps the source view when prettifying fails', async () => {
    format.mockRejectedValue(new Error('invalid html'));
    renderEdit({ selected: true });
    await waitForEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    await waitFor(() => expect(format).toHaveBeenCalled());
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
    expect(baseProps.onChangeBlock).not.toHaveBeenCalled();
  });

  it('delegates syntax highlighting to the lazily loaded prism core', async () => {
    renderEdit();
    await waitForEditor();

    expect(mocks.editorProps.current.highlight('<b>x</b>')).toBe('highlighted');
    expect(prismCore.highlight).toHaveBeenCalledWith(
      '<b>x</b>',
      prismCore.languages.html,
      'html',
    );
  });

  it('falls back to a no-op highlighter without the prism library', async () => {
    renderEdit({ prismCore: undefined });
    await waitForEditor();

    expect(mocks.editorProps.current.highlight()).toBeUndefined();
  });
});
