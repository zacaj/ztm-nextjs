'use client';

import { devUpdate, getMatches, nextRound, saveMatchResults } from '@/apis/tournament.api';
import { repeat, seq } from '@/util/misc';
import { FCn, Loading, usePlayer, useQueryParam } from "@/util/react";
import { useGet } from "@/util/rest";
import { TourBase } from "@/util/types";
import { RepeatIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Heading, HStack, Select, Spacer, VStack } from "@chakra-ui/react";
import useLocalStorage from 'use-local-storage';
import { MatchList } from './MatchList';

// eslint-disable-next-line complexity
export const Matches: FCn<{ tour: TourBase }> = ({ tour }) => {
  const { player } = usePlayer(tour);
  const [isTd] = useLocalStorage(`isTd`, false);
  const [roundNum, setRound] = useQueryParam(`round`, Number);
  const {
    data: { matches = [], curRound = undefined } = {},
    isLoading,
    refresh: refreshMatches,
  } = useGet(
    `tournament/${tour.id}/matches`+(roundNum? `/rounds/${roundNum}` : ``),
    () => getMatches(tour.id, roundNum? { roundNum } : undefined),
  );
  const completed = matches.filter(m => m.completed);
  const inProgress = matches.filter(m => !m.completed);

  if (isLoading) return <Loading/>;
  return <>
    <VStack align="stretch">
      {!!isTd && (
        <HStack>
          <ButtonGroup size='sm'>
            Debugging:
            <Spacer/>
            <Button onClick={() => void Promise.all(
              inProgress.map(m => saveMatchResults(m.id,
                m.players.shuffled().map((p, i) => ({ playerId: p.playerId, place: i+1 })))),
            ).then(refreshMatches)} isDisabled={!inProgress.length}
            >
              Finish All
            </Button>
            <Button onClick={() => void devUpdate(`match`, {
              where: {
                id: { in: completed.map(m => m.id) },
              },
              data: {
                completed: null,
              },
            }).then(() => devUpdate(`matchPlayer`, {
              where: {
                matchId: {
                  in: completed.map(m => m.id),
                },
              },
              data: {
                place: null,
                score: null,
              },
            })).then(refreshMatches)} isDisabled={!completed.length}
            >Unfinish All</Button>
          </ButtonGroup>
        </HStack>
      )}
      <HStack>
        <ButtonGroup size='sm'>
          <Button onClick={() => refreshMatches()} leftIcon={<RepeatIcon/>} isLoading={isLoading}>Refresh</Button>
        </ButtonGroup>
        {!!curRound &&
        <Select size="sm" width='initial'
          value={roundNum ?? curRound} onChange={e => setRound(e.target.value!==curRound.toString() ? Number(e.target.value) : undefined)}
        >
          <option value={curRound}>{`Round ${curRound} (current)`}</option>
          {seq(curRound-1, 1).reverse().map(r => <option value={r} key={r}>{`Round ${r}`}</option>)}
        </Select>}
        <Spacer/>
        {!!isTd && (
          <ButtonGroup size="sm">
            {tour.type === `MATCHPLAY` && !inProgress.length && completed[0]?.roundNum === curRound &&
          <Button onClick={() => void nextRound(tour.id).then(refreshMatches)}>Next Round</Button>
            }
          </ButtonGroup>
        )}
      </HStack>
      {matches.length?
        <>
          {!!inProgress.length && !!completed.length && <Heading size="sm">In Progress ({inProgress.length}/{matches.length})</Heading>}
          {!!inProgress.length &&
          <MatchList tour={tour} matches={inProgress} refreshMatches={refreshMatches}
            highlightPlayerId={player?.id}
          />}
          {!!completed.length && <Heading size="sm">Completed ({completed.length}/{matches.length})</Heading>}
          {!!completed.length &&
          <MatchList tour={tour} matches={completed} refreshMatches={refreshMatches}
            highlightPlayerId={player?.id}
          />}
        </>
        :
        <>No matches found!</>
      }
    </VStack>
  </>;
};