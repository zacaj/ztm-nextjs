'use client';

import { FCcn, useQueryParam } from "@/util/react";
import { TourBase } from "@/util/types";
import { Card, CardBody, CardHeader, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Games } from "./Games";
import { Matches } from "./Matches";

export const TournamentPage: FCcn<{ tour: TourBase }> = ({ tour, children }) => {
  const [tabIndex, setTabIndex] = useQueryParam(`tab`, Number);

  return (
    <Card>
      <CardHeader>Tournament: {tour.name}</CardHeader>
      <CardBody>
        <Tabs defaultIndex={tabIndex} onChange={setTabIndex} >
          <TabList>
            <Tab>Matches</Tab>
            <Tab>Games</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Matches tour={tour}/>
            </TabPanel>
            <TabPanel>
              <Games tour={tour}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {children}
      </CardBody>
    </Card>
  );
};