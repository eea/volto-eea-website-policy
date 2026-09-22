import cx from 'classnames';
import { DefaultCardLayout } from '@eeacms/volto-listing-block/blocks/Listing/item-templates/CardTemplates';

const MemberLogoCard = (props) => {
  const { item } = props;
  const href = item.external_url || item['@id'];

  return (
    <DefaultCardLayout
      {...props}
      item={{ ...item, '@id': href }}
      className={cx(props.className, 'item-card member-logo-card')}
    />
  );
};

export default MemberLogoCard;
