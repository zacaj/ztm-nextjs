'use client';

import { FCcn, Tabs, useQueryParam, type Tab } from "@/util/react";
import { TourBase } from "@/util/types";
import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import { Games } from "./Games";
import { Matches } from "./Matches";
import { Players } from "./Players";
import { You } from "./You";
import { useMemo } from "react";
import { Standings } from "./Standings";
import dynamic from "next/dynamic";

const TournamentPage_: FCcn<{ tour: TourBase }> = ({ tour, children }) => {
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
      <CardHeader>Tournament: {tour.name}</CardHeader>
      <CardBody>
        <Tabs tabs={tabs}/>
        {children}
      </CardBody>
    </Card>
  );
};


// const X = dynamic(Promise.resolve(TournamentPage_), { ssr: false });

// export const TournamentPage = (props: any) => <TournamentPage_ {...props}/>;
export const TournamentPage = TournamentPage_;