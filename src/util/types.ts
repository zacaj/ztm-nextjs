import { Game, Match, Player, Tournament } from "@prisma/client";

export type TourBase = Tournament & {
  games: ({ _count: { matches: number }} & Game)[];
  players: Player[];
} & {
};
export type Match_ = Match & { game: Game; players: Player[] };


export class UserError extends Error {

}