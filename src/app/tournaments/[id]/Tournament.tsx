import { FC, FCc, FCcn } from "@/util/react";
import { Card, CardBody, CardHeader, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Tournament } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const TournamentPage: FCcn<{ tour: Tournament }> = ({ tour, children }) => {

  return (
    <Card>
      <CardHeader>Tournament: {tour.name}</CardHeader>
      <CardBody>
        {/* <HStack> */}
        {/* <Link href="matches">Matches</Link>
        <Link href="games">Games</Link> */}
        {/* </HStack> */}
        {/* <Tabs>
        <TabList>
          <Tab>Matches</Tab>
          <Tab>Games</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            // {/* <Matches tour={tour} /> */}
        {/* </TabPanel>
          <TabPanel>
            <Games tour={tour} />
          </TabPanel>
        </TabPanels>
      </Tabs> */}
        {children}
      </CardBody>
    </Card>
  );
};