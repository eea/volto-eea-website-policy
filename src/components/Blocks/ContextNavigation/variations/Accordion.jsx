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
import downIcon from '@plone/volto/icons/down-key.svg';

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
  } = item;

  const isActive = is_current || !!activeItems[normalized_id];
  const hasChildItems = childItems && childItems.length > 0;
  return (
    <React.Fragment key={index}>
      {hasChildItems ? (
        <Accordion.Title
          active={isActive}
          index={index}
          onKeyDown={(e) => {
            if (e.keyCode === 13 || e.keyCode === 32) {
              e.preventDefault();
              handleTitleClick(normalized_id, hasChildItems);
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={isActive}
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
            <Accordion className="default" key={index} id={index}>
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

const findTopLevelParentWithCurrent = (items) => {
  const resultParents = new Set();
  const computeIsCurrent = (items, parent = null) => {
    for (const item of items) {
      resultParents.add(parent);
      if (item.is_current) {
        return resultParents;
      }
      if (item.items && item.items.length > 0) {
        const foundParents = computeIsCurrent(item.items, item);
        if (foundParents) return foundParents;
      }
    }
    return null;
  };

  computeIsCurrent(items);
  return Array.from(resultParents);
};

const AccordionNavigation = (props) => {
  const { navigation = {} } = props;
  const { items = [] } = navigation;
  const intl = useIntl();
  const [activeItems, setActiveItems] = React.useState({});

  const [isNavOpen, setNavOpen] = React.useState(true);

  const handleTitleClick = (index, hasChildItems) => {
    if (hasChildItems) {
      setActiveItems((prevActiveItems) => ({
        ...prevActiveItems,
        [index]: !prevActiveItems[index],
      }));
    }
  };

  React.useEffect(() => {
    const parents = findTopLevelParentWithCurrent(items);
    if (parents.length) {
      const idMapping = parents
        .filter(Boolean)
        .reduce((acc, item) => ({ ...acc, [item?.normalized_id]: true }), {});

      setActiveItems((prevActiveItems) => ({
        ...prevActiveItems,
        ...idMapping,
      }));
    }
  }, [items]);

  const onClickSummary = (e) => {
    e.preventDefault();
    setNavOpen(!isNavOpen);
  };

  return items.length ? (
    <nav className="context-navigation">
      <details open={isNavOpen}>
        {navigation.has_custom_name ? (
          <summary
            className="context-navigation-header"
            onClick={onClickSummary}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                onClickSummary(e);
              }
            }}
          >
            {navigation.title}
            <Icon
              name={isNavOpen ? upIcon : downIcon}
              size="40px"
              style={{ marginLeft: 'auto' }}
            />
          </summary>
        ) : (
          <summary
            className="context-navigation-header"
            onClick={onClickSummary}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                onClickSummary(e);
              }
            }}
          >
            {intl.formatMessage(messages.navigation)}
          </summary>
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
      </details>
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
