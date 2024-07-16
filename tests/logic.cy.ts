import { range } from "@/util/misc";
import "cypress-map";
import { genGroupSizes } from "../src/apis/logic";

describe(`genGroupSizes`, () => {
  for (const maxPlayers of [2, 3, 4, 5, 6])
    describe(`maxPlayers=${maxPlayers}`, () => {
      it(`should give even groups if divisible`, () => {
        const groups = genGroupSizes(60, maxPlayers);

        cy.wrap(groups);
        expect(groups).length(60 / maxPlayers);
        // expect(groups).all.members(maxPlayers);
      });

      const evenGroups = genGroupSizes(60, maxPlayers);

      for (const less of range(1, maxPlayers - 1)) {
        it(`should work with ${less} less`, () => {
          const numPlayers = 60 - less;
          const groups = genGroupSizes(numPlayers, maxPlayers);

          cy.wrap(groups);
          expect(groups.sum()).to.equal(numPlayers);
          expect(groups).length(evenGroups.length);
          // console.log(`Players: ${numPlayers}, max: ${maxPlayers}:`, groups);
        });
      }

      for (const numPlayers of range(1, maxPlayers * 2 - 1)) {
        it(`should work with only ${numPlayers}`, () => {
          const groups = genGroupSizes(numPlayers, maxPlayers);

          cy.wrap(groups);
          expect(groups.sum()).to.equal(numPlayers);
          // console.log(`Players: ${numPlayers}, max: ${maxPlayers}:`, groups);
        });
      }
    });
});
