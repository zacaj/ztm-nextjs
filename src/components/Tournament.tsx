'use client';

import { FCcn, useQueryParam } from "@/util/react";
import { TourBase } from "@/util/types";
import { Card, CardBody, CardHeader, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Games } from "./Games";
import { Matches } from "./Matches";
import { Players } from "./Players";
import { You } from "./You";

export const TournamentPage: FCcn<{ tour: TourBase }> = ({ tour, children }) => {
  const [tabIndex, setTabIndex] = useQueryParam(`tab`, Number);

  return (
    <Card>
      <CardHeader>Tournament: {tour.name}</CardHeader>
      <CardBody>
        <Tabs defaultIndex={tabIndex} onChange={setTabIndex} >
          <TabList>
            <Tab>You</Tab>
            <Tab>Matches</Tab>
            <Tab>Games</Tab>
            <Tab>Players</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <You tour={tour}/>
            </TabPanel>
            <TabPanel>
              <Matches tour={tour}/>
            </TabPanel>
            <TabPanel>
              <Games tour={tour}/>
            </TabPanel>
            <TabPanel>
              <Players tour={tour}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {children}
      </CardBody>
    </Card>
  );
};