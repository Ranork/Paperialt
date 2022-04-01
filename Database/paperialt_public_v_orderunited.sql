create view v_orderunited
            (username, walletname, positiontype, id, wallet, position, type, symbol, targetprice, amount, startdate,
             finishdate, active, explanation, endtype, bs)
as
SELECT (SELECT w.username
        FROM tbl_wallet w
        WHERE o.wallet = w.id::integer) AS username,
       (SELECT w.name
        FROM tbl_wallet w
        WHERE o.wallet = w.id::integer) AS walletname,
       (SELECT p.type
        FROM tbl_position p
        WHERE o."position" = p.id)      AS positiontype,
       o.id,
       o.wallet,
       o."position",
       o.type,
       o.symbol,
       o.targetprice,
       o.amount,
       o.startdate,
       o.finishdate,
       o.active,
       o.explanation,
       o.endtype,
       o.bs
FROM tbl_order o;

alter table v_orderunited
    owner to ranork;

INSERT INTO public.v_orderunited (username, walletname, positiontype, id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES ('ranork', 'Unnamed Wallet', 'SHORT', 5, 9, 1, 'LIMIT', 'TSLA', 12.34, 12.54, '2022-03-29 01:45:06.000000', null, false, 'TEST ORDER', null, 'BUY');
INSERT INTO public.v_orderunited (username, walletname, positiontype, id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES ('ranork', 'Unnamed Wallet', 'SHORT', 2, 9, 1, 'LIMIT', 'TSLA', 1077, 1, '2022-03-27 15:04:53.000000', '2022-04-01 23:21:45.000000', false, null, null, 'SELL');
INSERT INTO public.v_orderunited (username, walletname, positiontype, id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES ('ranork', 'Unnamed Wallet', 'SHORT', 7, 9, 1, 'LIMIT', 'TSLA', 1100, 4, '2022-04-01 23:39:36.000000', '2022-04-02 00:00:17.000000', false, 'TEST ORDER', 'COMPLETED', 'BUY');
INSERT INTO public.v_orderunited (username, walletname, positiontype, id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES ('ranork', 'Unnamed Wallet', 'SHORT', 6, 9, 1, 'LIMIT', 'TSLA', 1200, 1, '2022-04-01 23:23:34.000000', null, false, 'TEST ORDER', 'CANCELLED', 'SELL');
