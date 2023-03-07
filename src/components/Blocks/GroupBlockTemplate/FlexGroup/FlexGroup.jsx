import { Button, Item as UiItem } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Icon, RenderBlocks } from '@plone/volto/components';
import FlexBlocksForm from './FlexBlocksForm';
import { emptyBlocksForm } from '@plone/volto/helpers';
import EditBlockWrapper from './EditBlockWrapper';

import helpSVG from '@plone/volto/icons/help.svg';
import './editor-flex.less';

const FlexGroup = (props) => {
  const {
    block,
    data,
    onChangeBlock,
    onChangeField,
    pathname,
    selected,
    selectedBlock,
    setSelectedBlock,
    manage,
    childBlocksForm,
    formDescription,
    isEditMode,
  } = props;
  const metadata = props.metadata || props.properties;
  const blockState = {};

  // Get editing instructions from block settings or props
  let instructions = data?.instructions?.data || data?.instructions;
  if (!instructions || instructions === '<p><br/></p>') {
    instructions = formDescription;
  }

  return isEditMode ? (
    <div className="flex-blocks-form">
      <FlexBlocksForm
        metadata={metadata}
        properties={childBlocksForm}
        manage={manage}
        selectedBlock={selected ? selectedBlock : null}
        allowedBlocks={data.allowedBlocks}
        title={data.placeholder}
        description={instructions}
        onSelectBlock={(id) => {
          setSelectedBlock(id);
        }}
        onChangeFormData={(newFormData) => {
          onChangeBlock(block, {
            ...data,
            data: newFormData,
          });
        }}
        onChangeField={(id, value) => {
          if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
            blockState[id] = value;
            onChangeBlock(block, {
              ...data,
              data: {
                ...data.data,
                ...blockState,
              },
            });
          } else {
            onChangeField(id, value);
          }
        }}
        pathname={pathname}
      >
        {({ draginfo }, editBlock, blockProps) => (
          <EditBlockWrapper
            draginfo={draginfo}
            blockProps={blockProps}
            disabled={data.disableInnerButtons}
            extraControls={
              <>
                {instructions && (
                  <>
                    <Button
                      icon
                      basic
                      title="Section help"
                      onClick={() => {
                        setSelectedBlock();
                        const tab = manage ? 0 : 1;
                        props.setSidebarTab(tab);
                      }}
                    >
                      <Icon name={helpSVG} className="" size="19px" />
                    </Button>
                  </>
                )}
              </>
            }
          >
            {editBlock}
          </EditBlockWrapper>
        )}
      </FlexBlocksForm>
    </div>
  ) : (
    <RenderBlocks {...props} metadata={metadata} content={data?.data || {}} />
  );
};

export default FlexGroup;
