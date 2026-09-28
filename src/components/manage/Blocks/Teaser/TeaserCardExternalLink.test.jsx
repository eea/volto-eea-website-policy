import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import TeaserCardExternalLink from './TeaserCardExternalLink';
import { getImageScaleParams } from '@eeacms/volto-object-widget/helpers';

jest.mock('@eeacms/volto-listing-block/blocks/Teaser/Card', () => ({
  __esModule: true,
  default: () => <div data-testid="default-teaser" />,
}));

jest.mock('@eeacms/volto-listing-block/PreviewImage', () => ({
  __esModule: true,
  default: ({ preview_image_url: previewImageUrl }) => (
    <img data-testid="preview" src={previewImageUrl} alt="" />
  ),
}));

jest.mock('@eeacms/volto-object-widget/helpers', () => ({
  __esModule: true,
  getImageScaleParams: jest.fn(),
}));

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  __esModule: true,
  flattenToAppURL: (url) => url,
}));

const hrefItem = {
  '@id': '/en/epanet/foo.png',
  image_field: 'image',
  image_scales: { image: [{ scales: { preview: { download: 'x' } } }] },
};

// an SVG logo: scales are listed but serve an empty response
const hrefItemSvg = {
  '@id': '/en/epanet/foo.svg',
  image_field: 'image',
  image_scales: {
    image: [
      {
        'content-type': 'image/svg+xml',
        scales: { preview: { download: 'x' } },
      },
    ],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

const renderCard = (data) => render(<TeaserCardExternalLink data={data} />);

describe('TeaserCardExternalLink', () => {
  it('renders the default teaser when there is no External_link', () => {
    const { getByTestId, container } = renderCard({ href: [hrefItem] });

    expect(getByTestId('default-teaser')).toBeInTheDocument();
    expect(container.querySelector('.external-teaser-card')).toBeNull();
  });

  it('puts the title above the image and links the image, not the title', () => {
    getImageScaleParams.mockReturnValue({ download: '/scaled/logo.png' });

    const { container, getByTestId } = renderCard({
      '@type': 'teaser',
      title: 'Austria',
      href: [hrefItem],
      External_link: 'https://example.org/',
    });

    const card = container.querySelector('.external-teaser-card');
    expect([...card.children].map((c) => c.className)).toEqual([
      'content',
      'image',
    ]);

    // title is plain text, image carries the link
    expect(card.querySelector('.header a')).toBeNull();
    const anchor = card.querySelector('a.image');
    expect(anchor).toHaveAttribute('href', 'https://example.org/');
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    expect(getByTestId('preview')).toHaveAttribute('src', '/scaled/logo.png');
  });

  it('uses the image itself for SVG logos', () => {
    const { getByTestId } = renderCard({
      '@type': 'teaser',
      title: 'Austria',
      href: [hrefItemSvg],
      External_link: 'https://example.org/',
    });

    expect(getByTestId('preview')).toHaveAttribute('src', '/en/epanet/foo.svg');
    expect(getImageScaleParams).not.toHaveBeenCalled();
  });

  it('keeps the SVG fallback when the teaser also carries a preview_image', () => {
    const { getByTestId } = renderCard({
      '@type': 'teaser',
      title: 'Austria',
      href: [hrefItemSvg],
      preview_image: [hrefItem],
      External_link: 'https://example.org/',
    });

    expect(getByTestId('preview')).toHaveAttribute('src', '/en/epanet/foo.svg');
    expect(getImageScaleParams).not.toHaveBeenCalled();
  });

  it('renders from preview_image when the teaser has no href', () => {
    getImageScaleParams.mockReturnValue({ download: '/scaled/logo.png' });

    const { getByTestId, container } = renderCard({
      '@type': 'teaser',
      title: 'Austria',
      preview_image: [hrefItem],
      External_link: 'https://example.org/',
    });

    expect(
      container.querySelector('.external-teaser-card'),
    ).toBeInTheDocument();
    expect(getByTestId('preview')).toHaveAttribute('src', '/scaled/logo.png');
  });

  it('falls back to the default teaser without a target or preview image', () => {
    const { getByTestId, container } = renderCard({
      External_link: 'https://example.org/',
    });

    expect(getByTestId('default-teaser')).toBeInTheDocument();
    expect(container.querySelector('.external-teaser-card')).toBeNull();
  });
});
