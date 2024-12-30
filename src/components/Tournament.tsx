'use client';

import { FCcn, FlexRow, style, useQueryParam } from "@/util/react";
import { Tabs, type Tab } from "@/util/Tabs";
import { TourBase } from "@/util/types";
import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import { Games } from "./Games";
import { Matches } from "./Matches";
import { Players } from "./Players";
import { You } from "./You";
import { useMemo } from "react";
import { Standings } from "./Standings";
import dynamic from "next/dynamic";
import { EditableInteger, EditableText } from "@/util/EditableText";
import { editTournament } from "@/apis/tournament.api";
import { useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";

const Field = style(FlexRow, {});

const TournamentPage_: FCcn<{ tour: TourBase }> = ({ tour, children }) => {
  const { refresh } = useRouter();
  const [isTd] = useLocalStorage(`isTd`, false);

  const isStarted = !tour.games.some(g => g._count.matches);
  const tabs = useMemo<Tab[]>(() => [
    {
      name: `You`,
      component: <You tour={tour}/>,
    },
    {
      name: `Standings`,
      component: <Standings tour={tour}/>,
      isHidden: isStarted,
    },
    {
      name: `Matches`,
      component: <Matches tour={tour}/>,
      isHidden: !tour.games.some(g => g._count.matches),
    },
    {
      name: `Games`,
      component: <Games tour={tour}/>,
    },
    {
      name: `Players`,
      component: <Players tour={tour}/>,
    },
  ], [isStarted, tour]);

  return (
    <Card>
      <CardHeader backgroundColor="#EEF">
        Tournament:
        <EditableText value={tour.name} placeholder="(unnamed)" onSave={name => editTournament({ id: tour.id, name }).then(refresh)}/>
      </CardHeader>
      <CardBody>
        <FlexRow flexWrap="wrap">
          {(tour.type===`FRENZY` || tour.type===`MATCHPLAY`) &&
            <Field>
              <span>Group Size</span>
              <EditableInteger min={2} value={tour.maxPlayers} onSave={maxPlayers => editTournament({ id: tour.id, maxPlayers }).then(refresh)}
                isDisabled={!isTd}
              />
            </Field>}
        </FlexRow>
        <Tabs tabs={tabs}/>
        {children}
      </CardBody>
    </Card>
  );
};


// const X = dynamic(Promise.resolve(TournamentPage_), { ssr: false });

// export const TournamentPage = (props: any) => <TournamentPage_ {...props}/>;
export const TournamentPage = TournamentPage_;