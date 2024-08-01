import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'semantic-ui-react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { defineMessages, useIntl } from 'react-intl';

import { flattenToAppURL } from '@plone/volto/helpers';
import { Icon, Image, UniversalLink } from '@plone/volto/components';
import { withContentNavigation } from '@plone/volto/components/theme/Navigation/withContentNavigation';

import upIcon from '@plone/volto/icons/up-key.svg';
import rightIcon from '@plone/volto/icons/right-key.svg';

const messages = defineMessages({
  navigation: {
    id: 'Navigation',
    defaultMessage: 'Navigation',
  },
});

function renderItems({
  item,
  index,
  activeItems,
  handleTitleClick,
  parentLevel,
}) {
  const level = parentLevel + 1;
  const {
    title,
    href,
    thumb,
    is_current,
    type,
    description,
    normalized_id,
    is_in_path,
    items: childItems,
    ...rest
  } = item;

  const computeActive = () => {
    const hasIsCurrent = childItems.some((child) => child.is_current);
    return is_current || !!activeItems[normalized_id] || hasIsCurrent;
  };

  const isActive = computeActive();
  const hasChildItems = childItems && childItems.length > 0;
  return (
    <React.Fragment key={index}>
      {hasChildItems ? (
        <Accordion.Title
          active={isActive}
          onClick={() => handleTitleClick(normalized_id, hasChildItems)}
        >
          {hasChildItems && (
            <Icon size="24px" name={isActive ? upIcon : rightIcon} />
          )}
          {thumb ? <Image src={flattenToAppURL(thumb)} /> : ''}
          <p>{title}</p>
        </Accordion.Title>
      ) : (
        <div
          className={cx('title', {
            active: is_current,
          })}
        >
          <p>
            {type !== 'link' ? (
              <Link
                to={flattenToAppURL(href)}
                title={description}
                className={cx(`contenttype-${type}`, {
                  in_path: is_in_path,
                })}
              >
                {thumb ? <Image src={flattenToAppURL(thumb)} /> : ''}
                {title}
              </Link>
            ) : (
              <UniversalLink href={flattenToAppURL(href)}>
                {title}
              </UniversalLink>
            )}
          </p>
        </div>
      )}
      {hasChildItems ? (
        <Accordion.Content active={isActive}>
          {hasChildItems && (
            <Accordion className="default">
              {childItems.map((item, index) =>
                renderItems({
                  item,
                  index,
                  activeItems,
                  handleTitleClick,
                  parentLevel: level,
                }),
              )}
            </Accordion>
          )}
        </Accordion.Content>
      ) : (
        ''
      )}
    </React.Fragment>
  );
}

const AccordionNavigation = (props) => {
  const { navigation = {} } = props;
  const { items = [] } = navigation;
  const intl = useIntl();
  const [activeItems, setActiveItems] = React.useState({});

  const handleTitleClick = (index, hasChildItems) => {
    if (hasChildItems) {
      setActiveItems((prevActiveItems) => ({
        ...prevActiveItems,
        [index]: !prevActiveItems[index],
      }));
    }
  };

  return items.length ? (
    <nav className="context-navigation">
      {navigation.has_custom_name ? (
        <div className="context-navigation-header">
          <Link to={flattenToAppURL(navigation.url || '')}>
            {navigation.title}
          </Link>
        </div>
      ) : (
        <div className="context-navigation-header">
          {intl.formatMessage(messages.navigation)}
        </div>
      )}
      <Accordion className="default">
        {items.map((item, index) =>
          renderItems({
            item,
            index,
            activeItems,
            handleTitleClick,
            parentLevel: 0,
          }),
        )}
      </Accordion>
    </nav>
  ) : (
    ''
  );
};

AccordionNavigation.propTypes = {
  /**
   * Navigation tree returned from @contextnavigation restapi endpoint
   */
  navigation: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ),
    has_custom_name: PropTypes.bool,
    title: PropTypes.string,
  }),
};

export default compose(withRouter, withContentNavigation)(AccordionNavigation);
