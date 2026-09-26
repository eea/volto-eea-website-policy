import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import MemberLogoCard from './MemberLogoCard';

// ConditionalLink renders a router Link (needs a Router + Redux store).
// Replace it with a plain anchor so we only assert MemberLogoCard's logic.
jest.mock(
  '@plone/volto/components/manage/ConditionalLink/ConditionalLink',
  () => {
    const React = require('react');
    return {
      __esModule: true,
      default: ({ condition, to, children, className }) =>
        condition
          ? React.createElement('a', { href: to, className }, children)
          : React.createElement(React.Fragment, null, children),
    };
  },
);

const ITEM_ID = '/en/epanet/our-group/albania.png';
const PREVIEW_URL = `${ITEM_ID}/@@images/preview.png`;
const FULL_URL = `${ITEM_ID}/@@images/image.png`;
const EXTERNAL_LINK = 'http://www.akm.gov.al/';

const makeItem = (overrides = {}) => ({
  '@id': ITEM_ID,
  title: 'Albania.png',
  image: {
    download: FULL_URL,
    scales: { preview: { download: PREVIEW_URL } },
  },
  ...overrides,
});

describe('MemberLogoCard', () => {
  it('links image and title to the data_provenance link, opening in a new tab', () => {
    const item = makeItem({
      data_provenance: {
        data: [{ '@id': 'uuid', link: EXTERNAL_LINK, title: 'Albania.png' }],
      },
    });

    const { container } = render(
      <MemberLogoCard item={item} itemModel={{ hasLink: true }} />,
    );

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', EXTERNAL_LINK);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('uses the preview scale for the image', () => {
    const item = makeItem({
      data_provenance: { data: [{ link: EXTERNAL_LINK }] },
    });

    const { container } = render(
      <MemberLogoCard item={item} itemModel={{ hasLink: true }} />,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', PREVIEW_URL);
  });

  it('falls back to the full image download when there is no preview scale', () => {
    const item = makeItem({
      image: { download: FULL_URL },
      data_provenance: { data: [{ link: EXTERNAL_LINK }] },
    });

    const { container } = render(
      <MemberLogoCard item={item} itemModel={{ hasLink: true }} />,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', FULL_URL);
  });

  it('falls back to the item @id when data_provenance has no link', () => {
    const { container } = render(
      <MemberLogoCard item={makeItem()} itemModel={{ hasLink: true }} />,
    );

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', ITEM_ID);
      expect(link).not.toHaveAttribute('target');
    });
  });

  it('renders no link in edit mode', () => {
    const item = makeItem({
      data_provenance: { data: [{ link: EXTERNAL_LINK }] },
    });

    const { container } = render(
      <MemberLogoCard item={item} itemModel={{ hasLink: true }} isEditMode />,
    );

    expect(container.querySelectorAll('a')).toHaveLength(0);
  });

  it('renders no link when hasLink is disabled in the card model', () => {
    const item = makeItem({
      data_provenance: { data: [{ link: EXTERNAL_LINK }] },
    });

    const { container } = render(
      <MemberLogoCard item={item} itemModel={{ hasLink: false }} />,
    );

    expect(container.querySelectorAll('a')).toHaveLength(0);
  });

  it('falls back to item.Title when item.title is missing', () => {
    const item = makeItem({ title: undefined, Title: 'Albania (Title)' });

    const { getByText } = render(
      <MemberLogoCard item={item} itemModel={{ hasLink: true }} />,
    );

    expect(getByText('Albania (Title)')).toBeInTheDocument();
  });

  it('renders the card when there is no image', () => {
    const item = { '@id': ITEM_ID, title: 'No image' };

    const { container } = render(
      <MemberLogoCard item={item} itemModel={{ hasLink: true }} />,
    );

    expect(container.querySelector('.member-logo-card')).toBeInTheDocument();
  });
});
