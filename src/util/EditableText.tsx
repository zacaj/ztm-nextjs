import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ButtonGroup, Editable, EditableInput, EditablePreview, EditablePreviewProps, Flex, IconButton, Input, useEditableControls } from "@chakra-ui/react";
import styled from "styled-components";
import { FC } from "./react";

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
  previewProps?: EditablePreviewProps;
}> = ({ value, onSave, startOpen, previewProps }) => {
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
      <EditablePreview minW="10ch" {...previewProps}/>
      {/* Here is the custom input */}
      <Input as={EditableInput}/>
      <EditableControls/>
    </Editable>
  );
};