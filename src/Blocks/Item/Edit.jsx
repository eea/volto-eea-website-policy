import React from 'react';
import { connect } from 'react-redux';
import config from '@plone/volto/registry';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import SlateEditor from 'volto-slate/editor/SlateEditor';
import { handleKey } from 'volto-slate/blocks/Text/keyboard';
import { uploadContent, saveSlateBlockSelection } from 'volto-slate/actions';

import { createSlateParagraph } from '@eeacms/volto-quote-block/helpers';

import Item from './Item';
import getSchema from './schema';

const Edit = (props) => {
  const { slate } = config.settings;
  const {
    data = {},
    block = null,
    selected = false,
    index,
    properties,
    onChangeBlock,
    onSelectBlock,
  } = props;
  const { description } = data;
  const schema = React.useMemo(() => getSchema(props), [props]);

  const withBlockProperties = React.useCallback(
    (editor) => {
      editor.getBlockProps = () => props;
      return editor;
    },
    [props],
  );

  const handleFocus = React.useCallback(() => {
    if (!selected) {
      onSelectBlock(block);
    }
  }, [onSelectBlock, selected, block]);

  return (
    <>
      <Item {...data} mode="edit">
        <SlateEditor
          index={index}
          properties={properties}
          extensions={slate.textblockExtensions}
          renderExtensions={[withBlockProperties]}
          value={createSlateParagraph(description)}
          onChange={(description) => {
            onChangeBlock(block, {
              ...data,
              description,
            });
          }}
          block={block}
          onFocus={handleFocus}
          onKeyDown={handleKey}
          selected={selected}
          placeholder="Add item description..."
          slateSettings={slate}
        />
      </Item>
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
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
)(Edit);
