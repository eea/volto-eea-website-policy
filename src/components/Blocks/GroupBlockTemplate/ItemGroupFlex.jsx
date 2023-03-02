import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Item as UiItem, Button } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { isArray, omit, without } from 'lodash';
import config from '@plone/volto/registry';
import { BlockDataForm, SidebarPortal, Icon } from '@plone/volto/components';
import SlateEditor from '@plone/volto-slate/editor/SlateEditor';
import { handleKey } from '@plone/volto-slate/blocks/Text/keyboard';
import {
  uploadContent,
  saveSlateBlockSelection,
} from '@plone/volto-slate/actions';
import EditBlockWrapper from '@eeacms/volto-group-block/components/manage/Blocks/Group/EditBlockWrapper';
import trashSVG from '@plone/volto/icons/delete.svg';

import Item from './Item';
import Schema from './Schema';
import { getItems } from './utils';
import './editor.less';

export const createSlateParagraph = (text) => {
  return isArray(text) ? text : config.settings.slate.defaultValue();
};

const messages = defineMessages({
  item: {
    id: 'Item',
    defaultMessage: 'Item',
  },
});

const ItemGroupFlex = (props) => {
  const { slate } = config.settings;
  const {
    data = {},
    block = null,
    selected = false,
    properties,
    onChangeBlock,
    selectedBlock,
    onSelectBlock,
    intl,
    setSelectedBlock,
    childBlocksForm,
    isEditMode,
  } = props;

  const getSchema = React.useCallback(
    (blockId) => {
      return Schema(data.data.blocks[blockId]);
    },
    [data.data.blocks],
  );

  const itemsData = childBlocksForm || data.data;
  const items = getItems(itemsData);

  const getValueFromSlate = React.useCallback(
    (uid) => {
      const res = data.data.blocks[uid].value;
      return createSlateParagraph(res);
    },
    [data.data.blocks],
  );

  const withBlockProperties = React.useCallback(
    (editor) => {
      editor.getBlockProps = () => props;
      return editor;
    },
    [props],
  );

  const handleFocus = React.useCallback(
    (id) => {
      setSelectedBlock(id);
    },
    [setSelectedBlock],
  );
  return (
    <UiItem.Group
      unstackable
      className={cx('row', 'flex-items-wrapper', 'item-group')}
    >
      {items.map(([uid, item], index) => (
        <>
          <Item
            {...data.data.blocks[uid]}
            isEditMode={isEditMode}
            className="flex-items-wrapper"
            description={getValueFromSlate(uid)}
          >
            <div
              role="presentation"
              className={cx('block slate', {
                selected: selected && selectedBlock === uid,
              })}
            >
              <SlateEditor
                index={index}
                properties={properties}
                extensions={slate.textblockExtensions}
                renderExtensions={[withBlockProperties]}
                value={getValueFromSlate(uid)}
                onChange={(description) => {
                  onChangeBlock(block, {
                    ...data,
                    data: {
                      ...data.data,
                      blocks: {
                        ...data.data.blocks,
                        [uid]: {
                          ...item,
                          value: description,
                        },
                      },
                    },
                  });
                }}
                block={uid}
                // onFocus={() => handleFocus(uid)}
                onClick={() => handleFocus(uid)}
                selected={selected && selectedBlock === uid}
                onKeyDown={handleKey}
                placeholder="Add item description..."
                slateSettings={slate}
              />
              {isEditMode && selected && selectedBlock === uid ? (
                <div className={`block-editor-${data['@type']}`}>
                  <div className="block-toolbar">
                    <Button
                      icon
                      basic
                      title="Remove block"
                      onClick={() => {
                        const newFormData = {
                          ...data.data,
                          blocks: omit({ ...data.data.blocks }, [uid]),
                          blocks_layout: {
                            ...data.data.blocks_layout,
                            items: without(
                              [...data.data.blocks_layout?.items],
                              uid,
                            ),
                          },
                        };
                        onChangeBlock(uid, newFormData);
                      }}
                      className="delete-button-group-block"
                      // aria-label={intl.formatMessage(messages.delete)}
                    >
                      <Icon name={trashSVG} size="19px" />
                    </Button>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </Item>

          <SidebarPortal selected={selected && selectedBlock === uid}>
            <BlockDataForm
              block={uid}
              schema={getSchema(uid)}
              title={intl.formatMessage(messages.item)}
              onChangeField={(id, value) => {
                onChangeBlock(block, {
                  ...data,
                  data: {
                    ...data.data,
                    blocks: {
                      ...data.data.blocks,
                      [uid]: {
                        ...item,
                        [id]: value,
                      },
                    },
                  },
                });
              }}
              formData={data.data.blocks[uid]}
            />
          </SidebarPortal>
        </>
      ))}
    </UiItem.Group>
  );
};

export default connect(
  (state, props) => {
    const blockId = props.block;
    return {
      defaultSelection: blockId
        ? state.slate_block_selections?.[blockId]
        : null,
      uploadRequest: state.upload_content?.[props.block]?.upload || {},
      uploadedContent: state.upload_content?.[props.block]?.data || {},
    };
  },
  {
    uploadContent,
    saveSlateBlockSelection, // needed as editor blockProps
  },
)(ItemGroupFlex);
