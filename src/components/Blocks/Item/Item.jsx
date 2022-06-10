import cx from 'classnames';
import { Item as UiItem, Icon } from 'semantic-ui-react';
import { serializeText } from '@eeacms/volto-eea-website-policy/helpers';

function Item({
  assetType,
  children,
  description,
  extra,
  header,
  icon,
  iconSize = 'huge',
  iconTheme,
  image,
  imageSize = 'tile',
  meta,
  mode = 'view',
  styles = {},
}) {
  const { verticalAlign } = styles;
  return (
    <UiItem.Group unstackable className="row">
      <UiItem className={cx(styles?.theme)}>
        {assetType === 'image' && image && (
          <UiItem.Image
            src={`${image}/@@images/image/preview`}
            className={cx('ui', imageSize)}
            alt={header || 'Item image'}
          />
        )}
        {assetType === 'icon' && icon && (
          <Icon className={cx(icon, iconTheme)} size={iconSize} />
        )}
        <UiItem.Content verticalAlign={verticalAlign}>
          {header && <UiItem.Header>{header}</UiItem.Header>}
          {meta && <UiItem.Meta>{meta}</UiItem.Meta>}
          {description && mode === 'view' && (
            <UiItem.Description>
              {serializeText(description)}
            </UiItem.Description>
          )}
          {mode === 'edit' && children}
          {extra && <UiItem.Extra>{extra}</UiItem.Extra>}
        </UiItem.Content>
      </UiItem>
    </UiItem.Group>
  );
}

export default Item;
