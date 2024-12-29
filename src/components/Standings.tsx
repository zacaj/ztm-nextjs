"use client";
import { addPlayer, editPlayer, getStandings } from "@/apis/tournament.api";
import { EditableText } from "@/util/EditableText";
import { FCn, Loading, LoadingError, usePlayer } from "@/util/react";
import { useGet } from "@/util/rest";
import { TourBase } from "@/util/types";
import { AddIcon, DeleteIcon, LockIcon, SpinnerIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup, FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { Field, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import useLocalStorage from "use-local-storage";

export const Standings: FCn<{ tour: TourBase }> = ({ tour }) => {
  const { refresh } = useRouter();
  const [isTd] = useLocalStorage(`isTd`, false);
  const { player } = usePlayer(tour);

  const [filter, setFilter] = useState<string>();


  const {
    data: standings, isLoading, refresh: refreshStandings, error: standingsErr,
  } = useGet(`tournament/${tour.id}/standings`,
    () => getStandings(tour.id)
    , { refreshIntervalSec: 60 },
  );

  if (!standings) return <LoadingError err={standingsErr}/>;

  return <>
    {/* <HStack>
      <Spacer/>
      <ButtonGroup size='sm'>
        <Button onClick={() => refresh()} leftIcon={<SpinnerIcon/>}>Refresh</Button>
        {!!isTd && (
          <Button leftIcon={<AddIcon/>}
            onClick={onOpen}
            ref={addButtonRef}
          >Add Player</Button>
        )}
      </ButtonGroup>
    </HStack> */}
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Name</Th>
            <Th>Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {standings.map((s) =>
            <Tr key={s.playerId} role="group" backgroundColor={s.playerId === player?.id? `#fc9` : undefined}>
              <Td>{s.rank}</Td>
              <Td>{s.player.name}</Td>
              <Td>{s.total}</Td>
            </Tr>)}
        </Tbody>
      </Table>
    </TableContainer>
  </>;
};