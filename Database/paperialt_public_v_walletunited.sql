create view v_walletunited
            (id, name, username, startbalance, currentbalance, isprivate, createdate, explanation, totalpositioncount,
             activepositioncount, positiontotal, activeordercount, activeordertotal, availablebalance, totalpnl)
as
SELECT w.id,
       w.name,
       w.username,
       w.startbalance,
       w.currentbalance,
       w.isprivate,
       w.createdate,
       w.explanation,
       (SELECT count(*) AS count
        FROM tbl_position p
        WHERE p.walletid = w.id::integer)                                                                AS totalpositioncount,
       (SELECT count(*) AS count
        FROM tbl_position p
        WHERE p.walletid = w.id::integer
          AND p.active = true)                                                                           AS activepositioncount,
       (SELECT sum(p.totalusd) AS sum
        FROM tbl_position p
        WHERE p.walletid = w.id::integer
          AND p.active = true)                                                                           AS positiontotal,
       (SELECT count(*) AS count
        FROM v_orderunited o
        WHERE o.wallet = w.id::integer
          AND o.active = true)                                                                           AS activeordercount,
       (SELECT sum(o.targetprice * o.amount) AS sum
        FROM v_orderunited o
        WHERE o.wallet = w.id::integer
          AND o.active = true)                                                                           AS activeordertotal,
       w.currentbalance - (
               CASE
                   WHEN ((SELECT sum(p.totalusd) AS sum
                          FROM tbl_position p
                          WHERE p.walletid = w.id::integer
                            AND p.active = true)) IS NULL THEN 0::double precision
                   ELSE (SELECT sum(p.totalusd) AS sum
                         FROM tbl_position p
                         WHERE p.walletid = w.id::integer
                           AND p.active = true)
                   END + ((SELECT CASE
                                      WHEN sum(o.targetprice * o.amount) IS NULL THEN 0::double precision
                                      ELSE sum(o.targetprice * o.amount)
                                      END AS sum
                           FROM v_orderunited o
                           WHERE o.wallet = w.id::integer
                             AND o.active = true
                             AND (o.positiontype::text = 'LONG'::text AND o.bs::text = 'BUY'::text OR
                                  o.positiontype::text = 'SHORT'::text AND o.bs::text =
                                                                           'SELL'::text))))              AS availablebalance,
       w.currentbalance - w.startbalance                                                                 AS totalpnl
FROM tbl_wallet w;

alter table v_walletunited
    owner to ranork;

INSERT INTO public.v_walletunited (id, name, username, startbalance, currentbalance, isprivate, createdate, explanation, totalpositioncount, activepositioncount, positiontotal, activeordercount, activeordertotal, availablebalance, totalpnl) VALUES ('9', 'Unnamed Wallet', 'ranork', 5000, 5009.64, false, '2022-03-26 02:10:14.000000', null, 1, 0, null, 0, null, 5009.64, 9.640000000000327);
