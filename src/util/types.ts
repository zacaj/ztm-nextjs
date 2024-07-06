import { Tournament, Game, Player, Match } from "@prisma/client";

export type TourBase = Tournament & { games: Game[]; players: Player[] };
export type Match_ = Match & { game: Game; players: Player[] };