import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'semantic-ui-react';
import cx from 'classnames';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { defineMessages, useIntl } from 'react-intl';

import { flattenToAppURL } from '@plone/volto/helpers';
import { Icon, UniversalLink } from '@plone/volto/components';
import { withContentNavigation } from '@plone/volto/components/theme/Navigation/withContentNavigation';

import upIcon from '@plone/volto/icons/up-key.svg';
import downIcon from '@plone/volto/icons/down-key.svg';

const messages = defineMessages({
  navigation: {
    id: 'Navigation',
    defaultMessage: 'Navigation',
  },
});

const AccordionNavigation = ({ navigation = {}, data = {} }) => {
  const { items = [], title, has_custom_name } = navigation;
  const { portal_types = [] } = data;
  const intl = useIntl();
  const [isNavOpen, setNavOpen] = React.useState(true);
  const [activeItems, setActiveItems] = React.useState({});

  const onClickSummary = React.useCallback((e) => {
    e.preventDefault();
    setNavOpen((prev) => !prev);
  }, []);

  const renderItems = ({ item, level = 0 }) => {
    const {
      title,
      href,
      is_current,
      is_in_path,
      items: childItems,
      type,
    } = item;
    const hasChildItems = childItems && childItems.length > 0;

    const checkIfActive = () => {
      return activeItems[href] !== undefined ? activeItems[href] : is_in_path;
    };

    const isActive = checkIfActive();

    const handleTitleClick = () => {
      setActiveItems((prev) => ({ ...prev, [href]: !isActive }));
    };

    const handleKeyDown = (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        handleTitleClick();
      }
    };

    return (
      <li
        className={cx({
          is_in_path,
          title: !hasChildItems,
          accordion_list_item: hasChildItems,
        })}
        key={href}
      >
        {hasChildItems ? (
          <Accordion className="default">
            <Accordion.Title
              active={isActive}
              as={'button'}
              aria-expanded={isActive}
              onClick={handleTitleClick}
              onKeyDown={handleKeyDown}
              className={cx({ active: is_in_path })}
            >
              <Icon name={isActive ? upIcon : downIcon} size="24px" />
              <span className="title-text">{title}</span>
            </Accordion.Title>
            <Accordion.Content active={isActive}>
              <ul className="accordion-list">
                {childItems
                  .filter((item) =>
                    portal_types.length
                      ? portal_types.includes(item['type'])
                      : item,
                  )
                  .map((child) =>
                    renderItems({ item: child, level: level + 1 }),
                  )}
              </ul>
            </Accordion.Content>
          </Accordion>
        ) : (
          <UniversalLink
            href={flattenToAppURL(href)}
            className={cx(`contenttype-${type}`, {
              current: is_current,
              in_path: is_in_path,
            })}
          >
            {title}
          </UniversalLink>
        )}
      </li>
    );
  };

  return items.length ? (
    <nav className="context-navigation">
      <details open={isNavOpen}>
        {/* eslint-disable-next-line */}
        <summary className="context-navigation-header" onClick={onClickSummary}>
          {has_custom_name ? title : intl.formatMessage(messages.navigation)}
          <Icon
            name={isNavOpen ? upIcon : downIcon}
            size="40px"
            style={{ marginLeft: 'auto' }}
          />
        </summary>
        <ul className="accordion-list">
          {items
            .filter((item) =>
              portal_types.length ? portal_types.includes(item['type']) : item,
            )
            .map((item, index) => renderItems({ item }))}
        </ul>
      </details>
    </nav>
  ) : null;
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
