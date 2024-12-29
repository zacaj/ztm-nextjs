SELECT
  "tournamentId",
  "playerId",
  sum(points) AS total
FROM
  "MatchPoints" mpts
GROUP BY
  "tournamentId",
  "playerId"
ORDER BY
  (sum(points)) DESC;