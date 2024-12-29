SELECT
  t.id AS "tournamentId",
  p.id AS "playerId",
  m.id AS "matchId",
  count(mpo.id) AS points,
  m."roundNum"
FROM
  (
    (
      (
        (
          "Tournament" t
          JOIN "Player" p ON ((t.id = p."tournamentId"))
        )
        JOIN "MatchPlayer" mp ON (
          (
            (mp.place IS NOT NULL)
            AND (mp."playerId" = p.id)
          )
        )
      )
      JOIN "Match" m ON (
        (
          (m.completed IS NOT NULL)
          AND (m.id = mp."matchId")
        )
      )
    )
    LEFT JOIN "MatchPlayer" mpo ON (
      (
        (mpo."matchId" = m.id)
        AND (mpo.id <> mp.id)
        AND (mpo.place IS NOT NULL)
        AND (mpo.place > mp.place)
      )
    )
  )
GROUP BY
  t.id,
  p.id,
  m.id
ORDER BY
  t.id,
  m.id,
  p.id;