'use client';

import { saveMatchResults } from '@/apis/tournament.api';
import { seq } from '@/util/misc';
import { FC, FCn, FlexRow, style } from "@/util/react";
import { useSet } from "@/util/rest";
import { Match_, TourBase, UserError } from "@/util/types";
import { Button, Center, Flex, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, SimpleGrid, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { Fragment, useCallback, useState } from 'react';
import useLocalStorage from 'use-local-storage';

const MB = style(Flex, { borderRadius: `5px`, background: `#EEE`, overflow: `hidden`, maxW: `25ch`, minW: `13ch`, flexDir: `column` }, {});
const MBHeader = style(FlexRow, { background: `#BBB`, fontWeight: 600, paddingX: 2, paddingY: 1, whiteSpace: `nowrap` }, {});
const MBGridItem = style(GridItem, { paddingX: 2, paddingY: 1 });
const MBGPlace = style(MBGridItem, { background: `#CCC`, minWidth: `3ch`, textAlign: `center` });
const MBGPlayer = style(MBGridItem, {});
export const MatchBox: FC<{ match: Match_; onClick?: (match: Match_) => void; highlightPlayerId?: bigint }> = ({ match, onClick, highlightPlayerId, ...props }) => {
  return (
    <MB {...props} onClick={() => onClick?.(match)} cursor={onClick? `pointer` : undefined}
      border={match.players.p(`id`).includes(highlightPlayerId!)? `2px dashed red` : ``}
    >
      <MBHeader>
        <span title={match.game?.name}>{match.game?.name ?? `Match ${match.id}`}</span>
      </MBHeader>
      <Grid templateColumns="min-content auto" gap={0}>
        {match.players.map((p, iP) => <Fragment key={p.id}>
          <MBGPlace>{p.place ?? ``}</MBGPlace>
          <MBGPlayer>{p.player.name}</MBGPlayer>
        </Fragment>)}
      </Grid>
    </MB>);
};

const PlacementTd = style(Td, { cursor: `pointer`, paddingX: 5, textAlign: `center` });

export const MatchList: FCn<{ tour: TourBase; matches: Match_[]; refreshMatches: () => void; highlightPlayerId?: bigint }> = ({ tour, matches, refreshMatches, highlightPlayerId }) => {
  const [isTd] = useLocalStorage(`isTd`, false);
  const toast = useToast();

  const [selected, setSelected] = useState<Match_>();
  const onMatchClick = useCallback((match: Match_) => {
    setSelected(match);
    setFinishing(match.players.sort((a, b) => Number(a.id-b.id)).map(mp => mp.place ?? 0));
  }, []);

  const [finishing, setFinishing] = useState<number[]>([]);
  const save = useSet(`tournament/${tour.id}/matches`,
    (m: Match_) => saveMatchResults(m.id, finishing.map((place, pI) => ({
      playerId: selected!.players.sort((a, b) => Number(a.id-b.id))[pI].playerId,
      place: place || null,
    })))
      .catch(err => {
        if (err instanceof UserError && err.message===`match is already completed`) {
          toast({
            description: `Results were already submitted for this match`,
          });
        }
        else throw err;
      })
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

  return <>
    {matches.length?
      <>
        {!!matches.length && <SimpleGrid gap={3} minChildWidth='12ch'>
          {matches.map(m =>
            <MatchBox match={m} key={m.id} onClick={!m.completed || isTd? onMatchClick : undefined}
              highlightPlayerId={highlightPlayerId}
            />)}
        </SimpleGrid>}
      </>
      :
      <>No matches found!</>
    }

    <Modal isOpen={!!selected} onClose={() => setSelected(undefined)} >
      <ModalOverlay/>
      <ModalContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          void save(selected!);
        }}
        >
          <ModalHeader>{selected?.game? `Match on ${selected.game.name}` : `Match Results`}</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Center>
              <Table gap={2} variant='striped' >
                <Thead>
                  <Tr>
                    <Th></Th>
                    {selected?.players.map((_, i) => <Th key={i}>
                      <Center>{i+1}st</Center>
                    </Th>)}
                  </Tr>
                </Thead>
                <Tbody>
                  {selected?.players.map((p, iP) => <Tr key={p.id}>
                    <Td textAlign="right">{p.player.name}</Td>
                    {selected.players.map((_, iN) => <PlacementTd onClick={() => onPlacementChange(iP, iN)} key={iN}>
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