import { getTournaments } from "@/apis/tournament.api";
import { Card, CardBody, CardHeader, Link, Table, Td, Th, Tr } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default async function Home() {
  const tournaments = await getTournaments();
  return (<>
    <Card>
      <CardHeader>ZTM</CardHeader>
      <CardBody>
        <Table>
          <Th>
            <Td>Name</Td>
            <Td>Format</Td>
          </Th>
          {tournaments.map(t =>
            <Tr key={t.id} >
              <Link href={`/tournaments/${t.id}`}>
                <Td>{t.name}</Td>
                <Td>{t.type}</Td>
              </Link>
            </Tr>,
          )}
        </Table>
      </CardBody>
    </Card>
  </>);
}
