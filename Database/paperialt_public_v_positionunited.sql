create view v_positionunited
            (username, id, active, walletid, type, startorder, endorder, market, symbol, totalusd, totalstock,
             createdate, isprivate, explanation, finishpnl, buyordershare, buyorderusd, sellordershare, sellorderusd)
as
SELECT (SELECT wu.username
        FROM v_walletunited wu
        WHERE wu.id::integer = p.walletid) AS username,
       p.id,
       p.active,
       p.walletid,
       p.type,
       p.startorder,
       p.endorder,
       p.market,
       p.symbol,
       p.totalusd,
       p.totalstock,
       p.createdate,
       p.isprivate,
       p.explanation,
       p.finishpnl,
       CASE
           WHEN ((SELECT sum(o.amount) AS sum
                  FROM tbl_order o
                  WHERE o."position" = p.id
                    AND o.bs::text = 'BUY'::text
                    AND o.active = true)) IS NULL THEN 0::double precision
           ELSE (SELECT sum(o.amount) AS sum
                 FROM tbl_order o
                 WHERE o."position" = p.id
                   AND o.bs::text = 'BUY'::text
                   AND o.active = true)
           END                             AS buyordershare,
       CASE
           WHEN ((SELECT sum(o.amount * o.targetprice) AS sum
                  FROM tbl_order o
                  WHERE o."position" = p.id
                    AND o.bs::text = 'BUY'::text
                    AND o.active = true)) IS NULL THEN 0::double precision
           ELSE (SELECT sum(o.amount * o.targetprice) AS sum
                 FROM tbl_order o
                 WHERE o."position" = p.id
                   AND o.bs::text = 'BUY'::text
                   AND o.active = true)
           END                             AS buyorderusd,
       CASE
           WHEN ((SELECT sum(o.amount) AS sum
                  FROM tbl_order o
                  WHERE o."position" = p.id
                    AND o.bs::text = 'SELL'::text
                    AND o.active = true)) IS NULL THEN 0::double precision
           ELSE (SELECT sum(o.amount) AS sum
                 FROM tbl_order o
                 WHERE o."position" = p.id
                   AND o.bs::text = 'SELL'::text
                   AND o.active = true)
           END                             AS sellordershare,
       CASE
           WHEN ((SELECT sum(o.amount * o.targetprice) AS sum
                  FROM tbl_order o
                  WHERE o."position" = p.id
                    AND o.bs::text = 'SELL'::text
                    AND o.active = true)) IS NULL THEN 0::double precision
           ELSE (SELECT sum(o.amount * o.targetprice) AS sum
                 FROM tbl_order o
                 WHERE o."position" = p.id
                   AND o.bs::text = 'SELL'::text
                   AND o.active = true)
           END                             AS sellorderusd
FROM tbl_position p;

alter table v_positionunited
    owner to ranork;

INSERT INTO public.v_positionunited (username, id, active, walletid, type, startorder, endorder, market, symbol, totalusd, totalstock, createdate, isprivate, explanation, finishpnl, buyordershare, buyorderusd, sellordershare, sellorderusd) VALUES ('ranork', 1, false, 9, 'SHORT', 0, 0, 'NASDAQ', 'TSLA', 9.640000000000327, 0, '2022-03-27 15:03:32.000000', false, null, 9.640000000000327, 0, 0, 0, 0);
