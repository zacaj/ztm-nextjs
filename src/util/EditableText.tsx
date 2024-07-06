import { useEditableControls, ButtonGroup, IconButton, Flex, Editable, EditableInput, EditablePreview, Input } from "@chakra-ui/react";
import { FC } from "./react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import styled from "styled-components";

const EditableHoverButton = styled.div`
  display: flex;

  &:not(:hover) {
    button {
      visibility: hidden;
    }
  }
`;

export const EditableText: FC<{
  value: string;
  onSave: (value: string) => void;
  startOpen?: boolean;
}> = ({ value, onSave, startOpen }) => {
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent='center' size='sm'>
        <IconButton aria-label="Save" icon={<CheckIcon/>} {...getSubmitButtonProps()}/>
        <IconButton aria-label="Cancel" icon={<CloseIcon/>} {...getCancelButtonProps()}/>
      </ButtonGroup>
    ) : (
      <Flex justifyContent='center'>
        <IconButton aria-label="Edit" size='sm' icon={<EditIcon/>}
          variant="chill"
          {...getEditButtonProps()}
        />
      </Flex>
    );
  }

  return (
    <Editable
      textAlign='left'
      defaultValue={value}
      isPreviewFocusable={false}
      onSubmit={onSave}
      as={EditableHoverButton}
      gap="2ch"
      startWithEditView={startOpen}
    >
      <EditablePreview minW="10ch"/>
      {/* Here is the custom input */}
      <Input as={EditableInput}/>
      <EditableControls/>
    </Editable>
  );
};