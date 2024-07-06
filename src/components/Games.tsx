"use client";
import { FCn } from "@/util/react";
import { TourBase } from "@/util/types";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, ButtonGroup, FormControl, FormLabel, Input, FormErrorMessage, Spacer,
} from '@chakra-ui/react';
import { EditableText } from "@/util/EditableText";
import { useRouter } from "next/navigation";
import { addGame, editGame } from "@/apis/tournament.api";
import { AddIcon, DeleteIcon, SpinnerIcon } from "@chakra-ui/icons";
import { useMemo, useRef, useState } from "react";
import { Field, Formik } from "formik";

export const Games: FCn<{ tour: TourBase }> = ({ tour }) => {
  const { refresh } = useRouter();
  // const [games, setGames] = useState(tour.games);
  const games= tour.games;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const addButtonRef = useRef<any>();
  const nameFieldRef = useRef<any>();

  const categories = useMemo(() => [...new Set(games.flatMap(g => g.categories))].filter(x => x), [games]);
  const [filter, setFilter] = useState<string>();

  return <>
    <HStack>
      <ButtonGroup size='sm' title="Categories">
        {categories.map(c => <Button onClick={() => setFilter(filter===c? undefined : c)}>{c}</Button>)}
      </ButtonGroup>
      <Spacer/>
      <ButtonGroup size='sm'>
        <Button onClick={() => refresh()} leftIcon={<SpinnerIcon/>}>Refresh</Button>
        <Button leftIcon={<AddIcon/>}
          onClick={onOpen}
          ref={addButtonRef}
        >Add Game</Button>
      </ButtonGroup>
    </HStack>
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Categories</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.filter(g => !filter || g.categories.includes(filter)).map(g => <Tr key={g.id} role="group">
            <Td>
              <EditableText value={g.name} onSave={v => void editGame({ ...g, name: v }).then(() => refresh())} startOpen={!g.id}/>
            </Td>
            <Td>{g.categories.join(', ')}</Td>
            <Td>
              <IconButton aria-label="Delete" icon={<DeleteIcon/>} size="sm"
                onClick={() => {} }
                sx={{ visibility: 'hidden' }} _groupHover={{ visibility: 'visible' }}
              />
            </Td>
          </Tr>)}
        </Tbody>
      </Table>
    </TableContainer>

    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={nameFieldRef}
      finalFocusRef={addButtonRef}
    >
      <Formik
        initialValues={{
          name: '',
          categories: '',
        }}
        onSubmit={async values => {
          await addGame({
            ...values,
            categories: values.categories.split(',').map(x => x.trim()),
            tournamentId: tour.id,
          });
          refresh();
          onClose();
        }}
      >
        {({ handleSubmit, errors, isSubmitting, values, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader>Add Game</ModalHeader>
              <ModalCloseButton/>
              <ModalBody>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" ref={nameFieldRef} value={values.name}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Categories</FormLabel>
                  <Field as={Input} name="categories"/>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant='ghost' type="submit" isLoading={isSubmitting}>Add</Button>
              </ModalFooter>
            </ModalContent>
          </form>)}
      </Formik>
    </Modal>
  </>;
};