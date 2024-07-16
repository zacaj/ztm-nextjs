import { range, seq } from "@/util/misc";

export function genGroupSizes(numPlayers: number, maxPlayers: number): number[] {
  const groups: number[] = [];

  for (let max = maxPlayers - 1; max > 0; max--) {
    if (numPlayers % maxPlayers === 0) break;
    for (const numGroups of range(1, Math.floor(numPlayers / max))) {
      if (numPlayers % maxPlayers === 0) break;
      if ((numPlayers - numGroups * max) % maxPlayers === 0) {
        seq(numGroups).forEach(() => {groups.push(max);
          numPlayers -= max;
        });
        break;
      }
    }
  }

  while (numPlayers > 0) {
    groups.push(maxPlayers);
    numPlayers -= maxPlayers;
  }

  return groups.reverse();
}
