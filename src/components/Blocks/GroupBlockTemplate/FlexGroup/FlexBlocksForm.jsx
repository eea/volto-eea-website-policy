import React from 'react';
import { useIntl } from 'react-intl';
import EditBlock from '@plone/volto/components/manage/Blocks/Block/Edit';
import { DragDropList } from '@plone/volto/components';
import {
  getBlocks,
  getBlocksFieldname,
  applyBlockDefaults,
} from '@plone/volto/helpers';
import {
  addBlock,
  insertBlock,
  changeBlock,
  deleteBlock,
  moveBlock,
  mutateBlock,
  nextBlockId,
  previousBlockId,
} from '@plone/volto/helpers';
import EditBlockWrapper from './EditBlockWrapper';
import { setSidebarTab } from '@plone/volto/actions';
import { useDispatch } from 'react-redux';
import { useDetectClickOutside, useEvent } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

const BlocksForm = (props) => {
  const {
    pathname,
    onChangeField,
    properties,
    onChangeFormData,
    selectedBlock,
    multiSelected,
    onSelectBlock,
    allowedBlocks,
    showRestricted,
    title,
    description,
    metadata,
    manage,
    children,
    isMainForm = true,
    blocksConfig = config.blocks.blocksConfig,
    editable = true,
    groupBlockData,
    groupBlock,
  } = props;

  const blockList = getBlocks(properties);

  const dispatch = useDispatch();
  const intl = useIntl();

  const ClickOutsideListener = () => {
    onSelectBlock(null);
    dispatch(setSidebarTab(0));
  };

  const ref = useDetectClickOutside({
    onTriggered: ClickOutsideListener,
    triggerKeys: ['Escape'],
    // Disabled feature for now https://github.com/plone/volto/pull/2389#issuecomment-830027413
    disableClick: true,
    disableKeys: !isMainForm,
  });

  const handleKeyDown = (
    e,
    index,
    block,
    node,
    {
      disableEnter = false,
      disableArrowUp = false,
      disableArrowDown = false,
    } = {},
  ) => {
    const isMultipleSelection = e.shiftKey;
    if (e.key === 'ArrowUp' && !disableArrowUp) {
      onFocusPreviousBlock(block, node, isMultipleSelection);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !disableArrowDown) {
      onFocusNextBlock(block, node, isMultipleSelection);
      e.preventDefault();
    }
    if (e.key === 'Enter' && !disableEnter) {
      onSelectBlock(onAddBlock(config.settings.defaultBlockType, index + 1));
      e.preventDefault();
    }
  };

  const onFocusPreviousBlock = (
    currentBlock,
    blockNode,
    isMultipleSelection,
  ) => {
    const prev = previousBlockId(properties, currentBlock);
    if (prev === null) return;

    blockNode.blur();

    onSelectBlock(prev, isMultipleSelection);
  };

  const onFocusNextBlock = (currentBlock, blockNode, isMultipleSelection) => {
    const next = nextBlockId(properties, currentBlock);
    if (next === null) return;

    blockNode.blur();

    onSelectBlock(next, isMultipleSelection);
  };

  const onMutateBlock = (id, value) => {
    const newFormData = mutateBlock(properties, id, value);
    onChangeFormData(newFormData);
  };

  const onInsertBlock = (id, value, current) => {
    const [newId, newFormData] = insertBlock(
      properties,
      id,
      value,
      current,
      config.experimental.addBlockButton.enabled ? 1 : 0,
    );

    const blocksFieldname = getBlocksFieldname(newFormData);
    const blockData = newFormData[blocksFieldname][newId];
    newFormData[blocksFieldname][newId] = applyBlockDefaults({
      data: blockData,
      intl,
      metadata,
      properties,
    });

    onChangeFormData(newFormData);
    return newId;
  };

  const onAddBlock = (type, index) => {
    if (editable) {
      const [id, newFormData] = addBlock(properties, type, index);
      const blocksFieldname = getBlocksFieldname(newFormData);
      const blockData = newFormData[blocksFieldname][id];
      newFormData[blocksFieldname][id] = applyBlockDefaults({
        data: blockData,
        intl,
        metadata,
        properties,
      });
      onChangeFormData(newFormData);
      return id;
    }
  };

  const onChangeBlock = (id, value) => {
    const newFormData = changeBlock(properties, id, value);
    onChangeFormData(newFormData);
  };

  const onDeleteBlock = (id, selectPrev) => {
    const previous = previousBlockId(properties, id);

    const newFormData = deleteBlock(properties, id);
    onChangeFormData(newFormData);

    onSelectBlock(selectPrev ? previous : null);
  };

  const onMoveBlock = (dragIndex, hoverIndex) => {
    const newFormData = moveBlock(properties, dragIndex, hoverIndex);
    onChangeFormData(newFormData);
  };

  const defaultBlockWrapper = ({ draginfo }, editBlock, blockProps) => (
    <EditBlockWrapper draginfo={draginfo} blockProps={blockProps}>
      {editBlock}
    </EditBlockWrapper>
  );

  const editBlockWrapper = children || defaultBlockWrapper;

  // Remove invalid blocks on saving
  // Note they are alreaady filtered by DragDropList, but we also want them
  // to be removed when the user saves the page next. Otherwise the invalid
  // blocks would linger for ever.
  for (const [n, v] of blockList) {
    if (!v) {
      const newFormData = deleteBlock(properties, n);
      onChangeFormData(newFormData);
    }
  }

  useEvent('voltoClickBelowContent', () => {
    if (!config.experimental.addBlockButton.enabled || !isMainForm) return;
    onSelectBlock(
      onAddBlock(config.settings.defaultBlockType, blockList.length),
    );
  });

  React.useEffect(() => {
    const groupItems = groupBlockData.data.blocks_layout;

    const queryAttr = 'data-rbd-droppable-id';
    const draggedDOM = document.querySelector(
      `.flex-blocks-form [${queryAttr}]`,
    );
    const isChildren = document.querySelector(
      '.flex-blocks-form .flex-items-wrapper',
    );
    if (!isChildren) {
      const div = document.createElement('div');
      // Refer to https://eea.github.io/volto-kitkat-frontend/?path=/docs/components-item-item-group-with-icons--flex-group#flex-group
      div.classList.add('ui', 'items', 'row', 'flex-items-wrapper');

      if (draggedDOM) {
        const DOMchildren = draggedDOM.children;
        Array.from(DOMchildren || []).forEach((child) =>
          div.appendChild(child),
        );
        draggedDOM.appendChild(div);
      }
    } else {
      const div = document.querySelector('.flex-items-wrapper');
      if (draggedDOM) {
        const DOMchildren = draggedDOM.children;
        Array.from(DOMchildren || [])
          .filter((child) => child.className === 'item')
          .forEach((child) => div.appendChild(child));
        draggedDOM.appendChild(div);
      }
    }
  }, [groupBlockData.data.blocks_layout]);

  return (
    <div className="blocks-form" ref={ref}>
      <fieldset className="invisible" disabled={!editable}>
        <DragDropList
          childList={blockList}
          onMoveItem={(result) => {
            const { source, destination } = result;
            if (!destination) {
              return;
            }
            const newFormData = moveBlock(
              properties,
              source.index,
              destination.index,
            );
            onChangeFormData(newFormData);
            return true;
          }}
        >
          {(dragProps) => {
            const { child, childId, index } = dragProps;
            const blockProps = {
              allowedBlocks,
              showRestricted,
              block: childId,
              data: child,
              handleKeyDown,
              id: childId,
              formTitle: title,
              formDescription: description,
              index,
              manage,
              onAddBlock,
              onInsertBlock,
              onChangeBlock,
              onChangeField,
              onChangeFormData,
              onDeleteBlock,
              onFocusNextBlock,
              onFocusPreviousBlock,
              onMoveBlock,
              onMutateBlock,
              onSelectBlock,
              pathname,
              metadata,
              properties,
              blocksConfig,
              selected: selectedBlock === childId,
              multiSelected: multiSelected?.includes(childId),
              type: child['@type'],
              editable,
              showBlockChooser: selectedBlock === childId,
            };
            return editBlockWrapper(
              dragProps,
              <EditBlock key={childId} {...blockProps} />,
              blockProps,
            );
          }}
        </DragDropList>
      </fieldset>
    </div>
  );
};

export default BlocksForm;
