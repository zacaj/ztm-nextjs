'use client';

import { devFinishAll, getMatches } from "@/apis/tournament.api";
import { FC, FCn, FlexCol, FlexRow, Loading, style } from "@/util/react";
import { useGet } from "@/util/rest";
import { Match_ } from "@/util/types";
import { SpinnerIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Flex, Grid, GridItem, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { Match, Tournament } from "@prisma/client";
import useSWR from "swr";

const MB = style(FlexCol, { borderRadius: '5px', background: '#EEE', overflow: 'hidden', maxW: '25ch', minW: '13ch' }, {});
const MBHeader = style(FlexRow, { background: '#BBB', fontWeight: 600, paddingX: 2, paddingY: 1, whiteSpace: 'nowrap' }, {});
const MBGridItem = style(GridItem, { paddingX: 2, paddingY: 1 });
const MBGPlace = style(MBGridItem, { background: '#CCC', minWidth: '3ch', textAlign: 'center' });
const MBGPlayer = style(MBGridItem, {});
export const MatchBox: FC<{ match: Match_ }> = ({ match, className }) => {
  return <MB className={className}>
    <MBHeader>
      <span title={match.game.name}>{match.game.name}</span>
    </MBHeader>
    <Grid templateColumns="min-content auto" gap={0}>
      {match.players.map((p, iP) => <>
        <MBGPlace>{match.completed? match.finishOrder.indexOf(iP+1)+1 : ''}</MBGPlace>
        <MBGPlayer>{p.name}</MBGPlayer>
      </>)}
    </Grid>
  </MB>;
};

export const Matches: FCn<{ tour: Tournament }> = ({ tour }) => {
  const { data: matches, isLoading, refresh } = useGet(`tournament/${tour.id}/matches`, () => getMatches(tour.id));
  const completed = matches?.filter(m => m.completed);
  const inProgress = matches?.filter(m => !m.completed);
  if (isLoading) return <Loading/>;
  return <VStack align="stretch">
    <HStack>
      <ButtonGroup size='sm'>
        <Button onClick={() => refresh()} leftIcon={<SpinnerIcon/>} isLoading={isLoading}>Refresh</Button>
      </ButtonGroup>
      <ButtonGroup size='sm'>
        <Button onClick={() => void devFinishAll(tour.id).then(refresh)} isDisabled={!inProgress?.length}>Finish All</Button>
      </ButtonGroup>
    </HStack>
    {matches?.length?
      <>
        {!!inProgress?.length && <SimpleGrid gap={3} minChildWidth='12ch'>
          {inProgress?.map(m => <MatchBox match={m} key={m.id}/>)}
        </SimpleGrid>}
        {!!completed?.length && <SimpleGrid gap={3} minChildWidth='12ch'>
          {completed?.map(m => <MatchBox match={m} key={m.id}/>)}
        </SimpleGrid>}
      </>
      :
      <>No matches found!</>
    }
  </VStack>;
};