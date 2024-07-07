'use client';

import { devUpdate, getMatches, nextRound, saveMatchResults } from '@/apis/tournament.api';
import '@/util/misc';
import { repeat, seq } from '@/util/misc';
import { FC, FCn, FlexRow, Loading, style, useQueryParam } from "@/util/react";
import { useGet, useSet } from "@/util/rest";
import { Match_, TourBase } from "@/util/types";
import { SpinnerIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Center, Flex, Grid, GridItem, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, Select, SimpleGrid, Spacer, Table, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { useCallback, useState } from 'react';

const MB = style(Flex, { borderRadius: `5px`, background: `#EEE`, overflow: `hidden`, maxW: `25ch`, minW: `13ch`, flexDir: `column` }, {});
const MBHeader = style(FlexRow, { background: `#BBB`, fontWeight: 600, paddingX: 2, paddingY: 1, whiteSpace: `nowrap` }, {});
const MBGridItem = style(GridItem, { paddingX: 2, paddingY: 1 });
const MBGPlace = style(MBGridItem, { background: `#CCC`, minWidth: `3ch`, textAlign: `center` });
const MBGPlayer = style(MBGridItem, {});
export const MatchBox: FC<{ match: Match_; onClick?: (match: Match_) => void }> = ({ match, onClick, ...props }) => {
  return <MB {...props} onClick={() => onClick?.(match)} cursor={onClick? `pointer` : undefined}>
    <MBHeader>
      <span title={match.game.name}>{match.game.name}</span>
    </MBHeader>
    <Grid templateColumns="min-content auto" gap={0}>
      {match.players.map((p, iP) => <>
        <MBGPlace>{match.completed? match.finishOrder.indexOf(iP+1)+1 : ``}</MBGPlace>
        <MBGPlayer>{p.name}</MBGPlayer>
      </>)}
    </Grid>
  </MB>;
};

const PlacementTd = style(Td, { cursor: `pointer`, paddingX: 5, textAlign: `center` });

export const Matches: FCn<{ tour: TourBase }> = ({ tour }) => {
  const [roundNum, setRound] = useQueryParam(`round`, Number);
  const { data:
    { matches = [], curRound = undefined } = {},
  isLoading,
  refresh: refreshMatches,
  } = useGet(`tournament/${tour.id}/matches`+(roundNum? `/rounds/${roundNum}` : ``), () => getMatches(tour.id, roundNum? { roundNum } : undefined));
  const completed = matches.filter(m => m.completed);
  const inProgress = matches.filter(m => !m.completed);

  const [selected, setSelected] = useState<Match_>();
  const onMatchClick = useCallback((match: Match_) => {
    setSelected(match);
    setFinishing(match.finishOrder);
  }, []);

  const [finishing, setFinishing] = useState<number[]>([]);
  const save = useSet(`tournament/${tour.id}/matches`,
    (m: Match_) => saveMatchResults(m.id, finishing)
      .then(refreshMatches)
      .then(() => setSelected(undefined),
      ));
  const onPlacementChange = useCallback((iP: number, iN: number) => setFinishing(f => {
    f = f.copy();
    for (let i = 0; i < f.length; i++)
      if (f[i] === iN + 1)
        f[i] = f[iP];
    f[iP] = iN + 1;

    if (f.filter(p => !p).length === 1) {
      f[f.findIndex(p => !p)] = seq(f.length, 1).find(p => !f.includes(p))!;
    }

    return f;
  }), []);

  if (isLoading) return <Loading/>;
  return <>
    <VStack align="stretch">
      <HStack>
        <ButtonGroup size='sm'>
          Debugging:
          <Spacer/>
          <Button onClick={() => void devUpdate(`match`, {
            where: {
              tournamentId: tour.id,
              completed: null,
            },
            data: {
              completed: new Date(),
              finishOrder: seq(tour.maxPlayers, 1).shuffle(),
            },
          }).then(refreshMatches)} isDisabled={!inProgress.length}
          >Finish All</Button>
          <Button onClick={() => void devUpdate(`match`, {
            where: {
              tournamentId: tour.id,
              completed: { not: null },
              roundNum: matches.map(m => m.roundNum).max(),
            },
            data: {
              completed: null,
              finishOrder: repeat(0, tour.maxPlayers),
            },
          }).then(refreshMatches)} isDisabled={!completed.length}
          >Unfinish All</Button>
        </ButtonGroup>
      </HStack>
      <HStack>
        <ButtonGroup size='sm'>
          <Button onClick={() => refreshMatches()} leftIcon={<SpinnerIcon/>} isLoading={isLoading}>Refresh</Button>
        </ButtonGroup>
        {!!curRound &&
        <Select size="sm" width='initial'
          value={roundNum ?? curRound} onChange={e => setRound(e.target.value!==curRound.toString() ? Number(e.target.value) : undefined)}
        >
          <option value={curRound}>{`Round ${curRound} (current)`}</option>
          {seq(curRound-1, 1).reverse().map(r => <option value={r}>{`Round ${r}`}</option>)}
        </Select>}
        <Spacer/>
        <ButtonGroup size="sm">
          {tour.type === `MATCHPLAY` && !inProgress.length && completed[0]?.roundNum === curRound &&
          <Button onClick={() => void nextRound(tour.id).then(refreshMatches)}>Next Round</Button>
          }
        </ButtonGroup>
      </HStack>
      {matches.length?
        <>
          {!!inProgress.length && <SimpleGrid gap={3} minChildWidth='12ch'>
            {inProgress.map(m => <MatchBox match={m} key={m.id} onClick={onMatchClick}/>)}
          </SimpleGrid>}
          {!!completed.length && <SimpleGrid gap={3} minChildWidth='12ch'>
            {completed.map(m => <MatchBox match={m} key={m.id}/>)}
          </SimpleGrid>}
        </>
        :
        <>No matches found!</>
      }
    </VStack>

    <Modal isOpen={!!selected} onClose={() => setSelected(undefined)} >
      <ModalOverlay/>
      <ModalContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          void save(selected!);
        }}
        >
          <ModalHeader>Match on {selected?.game.name}</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Center>
              <Table gap={2} variant='striped' >
                <Thead>
                  <Th></Th>
                  {selected?.players.map((_, i) => <Th key={i}>
                    <Center>{i+1}st</Center>
                  </Th>)}
                </Thead>
                <Tbody>
                  {selected?.players.map((p, iP) => <Tr>
                    <Td textAlign="right">{p.name}</Td>
                    {selected.players.map((_, iN) => <PlacementTd onClick={() => onPlacementChange(iP, iN)}>
                      <Radio onChange={() => onPlacementChange(iP, iN)} isChecked={finishing[iP] === iN+1}
                        borderColor='#555' size='lg'
                      />
                    </PlacementTd>)}
                  </Tr>)}
                </Tbody>
              </Table>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={() => setSelected(undefined)}>
              Close
            </Button>
            <Button colorScheme='blue' type="submit" isLoading={save.isLoading}>Save</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  </>;
};