import React from 'react';
import { render } from '@testing-library/react';
import { FrequencyOfDissemination } from './FrequencyOfDissemination';

describe('FrequencyOfDissemination', () => {
  it('renders "Once a year" when value is 1', () => {
    const { getByText } = render(<FrequencyOfDissemination value={1} />);
    expect(getByText('Once a year')).toMatchSnapshot();
  });

  it('renders "Every 2 years" when value is 2', () => {
    const { getByText } = render(<FrequencyOfDissemination value={2} />);
    expect(getByText('Every 2 years')).toMatchSnapshot();
  });

  it('renders custom text when children prop is provided', () => {
    const { getByText } = render(
      <FrequencyOfDissemination value={3}>
        {(text) => `Frequency: ${text}`}
      </FrequencyOfDissemination>,
    );
    expect(getByText('Frequency: Every 3 years')).toMatchSnapshot();
  });

  it('renders nothing when value is falsy', () => {
    const { container } = render(<FrequencyOfDissemination value={0} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
