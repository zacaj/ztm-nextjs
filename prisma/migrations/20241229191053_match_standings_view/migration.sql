create view "MatchPoints" as
select t.id as "tournamentId", p.id as "playerId", m.id as "matchId", COUNT(mpO.id) as points, m."roundNum" 
from "Tournament" t 
inner join "Player" p on t.id = p."tournamentId" 
inner join "MatchPlayer" mp on mp.place is not null and mp."playerId" = p.id
inner join "Match" m on m.completed is not null and m.id  = mp."matchId" 
left join "MatchPlayer" mpO on mpO."matchId" = m.id and mpO.id != mp.id and mpO.place is not null and mpO.place > mp.place
group by t.id, p.id, m.id
order by t.id desc, m.id desc, p.id asc;

create view "MatchStandings" as
select s.*,
       RANK() over (partition by s."tournamentId" order by total desc) as rank
from (
	select mpts."tournamentId", mpts."playerId", SUM(mpts.points) as total
	from "MatchPoints" mpts
	group by mpts."tournamentId", mpts."playerId"
) s
order by s."tournamentId" desc,  s.total desc;