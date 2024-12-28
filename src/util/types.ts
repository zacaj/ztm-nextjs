import { Game, Match, Player, Tournament, type MatchPlayer } from "@prisma/client";

export type TourBase = Tournament & {
  games: ({ _count: { matches: number }} & Game)[];
  players: ({ _count: { matches: number }} & Player)[];
} & {
};
export type Match_ = Match & { game: Game | null; players: (MatchPlayer & { player: Player })[] };


export class UserError extends Error {

}