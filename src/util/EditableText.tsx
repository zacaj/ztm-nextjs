import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ButtonGroup, Editable, EditableInput, EditablePreview, EditablePreviewProps, Flex, IconButton, Input, useEditableControls, type HTMLChakraProps, type InputProps } from "@chakra-ui/react";
import styled from "styled-components";
import { FC } from "./react";
import type { ComponentProps } from "react";

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
  onSave: (value: string) => void|Promise<void>;
  startOpen?: boolean;
  previewProps?: EditablePreviewProps;
  inputProps?: InputProps;
  placeholder?: string;
  isDisabled?: boolean; // whether it's editable or readonly
}> = ({ value, onSave, startOpen, previewProps, inputProps, isDisabled, placeholder }) => {
  function EditableControls({ isDisabled }: { isDisabled?: boolean }) {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();
    if (isDisabled)
      return null;

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
      isDisabled={isDisabled}
      textAlign='left'
      defaultValue={value}
      isPreviewFocusable={false}
      onSubmit={onSave}
      as={EditableHoverButton}
      gap="2ch"
      startWithEditView={startOpen}
      placeholder={placeholder}
    >
      <EditablePreview minW="10ch" {...previewProps}/>
      {/* Here is the custom input */}
      <Input as={EditableInput} {...inputProps}/>
      <EditableControls
        isDisabled={isDisabled}
      />
    </Editable>
  );
};

export const EditableInteger: FC<Omit<ComponentProps<typeof EditableText>, `onSave` | `value`> & {
  value: number;
  onSave: (value: number) => void|Promise<void>;
  min?: number;
  max?: number;
}> = ({ inputProps, value, onSave, min, max, ...props }) => {
  return <EditableText {...props} inputProps={{ type: `number`, step: 1, min: min ?? 0, max, ...inputProps }} value={`${value}`}
    onSave={(val) => onSave(Number(val))}
  />;
};