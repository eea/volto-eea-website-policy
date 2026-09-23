import React from 'react';
import cx from 'classnames';
import { Card as UiCard } from 'semantic-ui-react';
import ConditionalLink from '@plone/volto/components/manage/ConditionalLink/ConditionalLink';
import PreviewImage from '@eeacms/volto-listing-block/PreviewImage';

const isExternalUrl = (url) => {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
};

const MemberLogoCard = (props) => {
  const { item, isEditMode, itemModel = {}, className } = props;
  const title = item.title || item.Title;
  const href = item.data_provenance?.data?.[0]?.link || item['@id'];
  const hasLink = !isEditMode && itemModel?.hasLink && !!href;
  const isExternal = isExternalUrl(href);

  // Full objects (fullobjects: 1) expose the image under `item.image`
  // without the `image_field`/`image_scales` metadata that PreviewImage
  // expects from summary results. Resolve the scale URL directly and pass
  // it via `preview_image_url` (used as-is by PreviewImage), avoiding
  // getImageScaleParams which cannot handle the image field object shape.
  const previewImageUrl =
    item.image?.scales?.preview?.download || item.image?.download;
  const image = (
    <PreviewImage
      item={item}
      preview_image_url={previewImageUrl}
      alt={title || ''}
    />
  );

  return (
    <UiCard
      fluid={true}
      className={cx('u-card', 'member-logo-card', className)}
    >
      {hasLink && isExternal ? (
        <a
          href={href}
          className="image"
          target="_blank"
          rel="noopener noreferrer"
          title={title}
        >
          {image}
        </a>
      ) : (
        <ConditionalLink
          to={href}
          item={item}
          condition={hasLink}
          className="image"
        >
          {image}
        </ConditionalLink>
      )}
      <UiCard.Content>
        <UiCard.Header>
          {hasLink && isExternal ? (
            <a
              className="header-link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>
          ) : (
            <ConditionalLink
              className="header-link"
              to={href}
              item={item}
              condition={hasLink}
            >
              {title}
            </ConditionalLink>
          )}
        </UiCard.Header>
      </UiCard.Content>
    </UiCard>
  );
};

export default MemberLogoCard;
