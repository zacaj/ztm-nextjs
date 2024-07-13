'use client';

import { getMatches } from '@/apis/tournament.api';
import { FCn, usePlayer } from "@/util/react";
import { useGet } from '@/util/rest';
import { TourBase } from "@/util/types";
import { RepeatClockIcon, RepeatIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup, Heading, HStack, VStack } from '@chakra-ui/react';
import { MatchList } from './MatchList';

export const You: FCn<{ tour: TourBase }> = ({ tour }) => {
  const { player, setPlayerId } = usePlayer(tour);
  const { data: matches, isLoading, refresh: refreshMatches,
  } = useGet(`tournament/${tour.id}/matches?player=${player?.id}`, () => player? getMatches(tour.id, { players: {
    some: { id: player.id },
  }}).then(({ matches }) => matches) : [], { refreshIntervalSec: 60 });
  const current = matches?.filter(m => !m.completed);
  const prev = matches?.filter(m => !!m.completed);

  if (player) {
    return <VStack align="stretch">
      <HStack>
        <Heading size="sm">You are: {player.name}</Heading>
        <Button onClick={() => setPlayerId(undefined)} size="sm" variant="outline"
          leftIcon={<RepeatClockIcon/>}
        >Sign Out</Button>
      </HStack>
      <HStack>
        <ButtonGroup size='sm'>
          <Button onClick={() => refreshMatches()} leftIcon={<RepeatIcon/>} isLoading={isLoading}>Refresh</Button>
        </ButtonGroup>
      </HStack>
      {!!current?.length && <>
        <Heading size="sm">Current Match</Heading>
        <MatchList tour={tour} matches={current} refreshMatches={refreshMatches}/>
      </>}
      {!!prev?.length && <>
        <Heading size="sm" mt={10}>Completed Matches</Heading>
        <MatchList tour={tour} matches={prev} refreshMatches={refreshMatches}/>
      </>}
    </VStack>;
  }
  else
    return <>
      <span>Who are you?</span>
      <VStack align="stretch">
        {tour.players.map(p => <Button key={p.id} onClick={() => setPlayerId(p.id)}>{p.name}</Button>)}
      </VStack>
    </>;
};