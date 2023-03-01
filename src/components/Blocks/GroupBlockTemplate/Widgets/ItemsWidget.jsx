import React from 'react';
import { v4 as uuid } from 'uuid';
import move from 'lodash-move';
import { useIntl, defineMessages } from 'react-intl';
import { Button } from 'semantic-ui-react';
import { Icon, FormFieldWrapper } from '@plone/volto/components';
import { emptyBlocksForm } from '@plone/volto/helpers';

import addSVG from '@plone/volto/icons/add.svg';

const messages = defineMessages({
  add: { id: 'Add', defaultMessage: 'Add' },
});

const ItemsWidget = (props) => {
  const intl = useIntl();
  const { value = {}, id, onChange, schema, block, data } = props;
  console.log(props);

  const objectSchema = typeof schema === 'function' ? schema(props) : schema;

  return (
    <div className="items-widget">
      <FormFieldWrapper {...props} noForInFieldLabel draggable={false}>
        <div className="add-item-button-wrapper">
          <Button
            compact
            icon
            aria-label={
              objectSchema.addMessage ||
              `${intl.formatMessage(messages.add)} ${objectSchema.title}`
            }
            onClick={() => {
              const { blocks, blocks_layout } = emptyBlocksForm();
              onChange(block, {
                ...value,
                ...data,
                blocks: {
                  ...value.blocks,
                  ...data.blocks,
                  ...blocks,
                },
                blocks_layout: {
                  ...value?.blocks_layout,
                  ...data.blocks_layout,
                  items: [...data.blocks_layout.items, ...blocks_layout.items],
                },
              });
            }}
          >
            <Icon name={addSVG} size="18px" />
            &nbsp;
            {/* Custom addMessage in schema, else default to english */}
            {objectSchema.addMessage || `Add ${objectSchema.title}`}
          </Button>
        </div>
      </FormFieldWrapper>
    </div>
  );
};

export default ItemsWidget;
