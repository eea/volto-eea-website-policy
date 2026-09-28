import React from 'react';
import cx from 'classnames';
import { Card as UiCard } from 'semantic-ui-react';
import TeaserCardTemplate from '@eeacms/volto-listing-block/blocks/Teaser/Card';
import PreviewImage from '@eeacms/volto-listing-block/PreviewImage';
import { getImageScaleParams } from '@eeacms/volto-object-widget/helpers';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

/**
 * Teaser card for an external link.
 *
 * Layout is `title` on top, the image below, and the *image* carries the link
 * (the title is plain text). When `External_link` is not set the default teaser
 * card is rendered instead.
 *
 * The image is resolved from the target item. Images without generated scales
 * (e.g. SVG logos) fall back to the image itself, because the scale URL would
 * be empty.
 */
const TeaserCardExternalLink = (props) => {
  const { data, isEditMode, className } = props;
  const external = data?.External_link;
  const target = data?.href?.[0];
  const preview = Array.isArray(data?.preview_image)
    ? data.preview_image[0]
    : data?.preview_image;
  const imageSource = target || preview;

  if (!external || !imageSource) {
    return <TeaserCardTemplate {...props} />;
  }

  const { '@type': _teaserType, ...teaserData } = data;
  const source = { ...imageSource, ...teaserData };
  const title = source.title || imageSource.title || '';
  const entry = imageSource.image_scales?.[imageSource.image_field]?.[0];
  // SVG scales are listed but serve an empty response, so use the image itself.
  // We must resolve the URL here (and always pass it to PreviewImage) because
  // PreviewImage would otherwise build the scale URL from `item` on its own,
  // which is exactly the empty SVG scale we need to avoid.
  const isSvg =
    entry?.['content-type'] === 'image/svg+xml' ||
    /\.svgz?(\?|#|$)/i.test(imageSource['@id'] || '');
  const hasScales = Boolean(entry?.scales && Object.keys(entry.scales).length);
  const previewImageUrl =
    !isSvg && hasScales
      ? getImageScaleParams(imageSource, 'preview')?.download
      : imageSource['@id']
        ? flattenToAppURL(imageSource['@id'])
        : undefined;

  const image = (
    <PreviewImage
      item={source}
      preview_image_url={previewImageUrl}
      alt={title}
    />
  );

  return (
    <UiCard
      fluid={true}
      className={cx('u-card', 'external-teaser-card', className, {
        'has--object-fit--contain':
          data.itemModel?.styles?.objectFit === 'contain',
      })}
    >
      <UiCard.Content>
        <UiCard.Header className="header">{title}</UiCard.Header>
      </UiCard.Content>
      {isEditMode ? (
        <div className="image">{image}</div>
      ) : (
        <a
          className="image"
          href={external}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
        >
          {image}
        </a>
      )}
    </UiCard>
  );
};

export default TeaserCardExternalLink;
