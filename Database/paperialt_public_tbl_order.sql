create table tbl_order
(
    id          serial,
    wallet      integer                                      not null,
    position    integer                                      not null,
    type        varchar(20) default 'LIMIT'::character varying,
    symbol      varchar(20)                                  not null,
    targetprice double precision                             not null,
    amount      double precision                             not null,
    startdate   timestamp                                    not null,
    finishdate  timestamp,
    active      boolean     default true,
    explanation varchar(100),
    endtype     varchar(50),
    bs          varchar(10) default 'BUY'::character varying not null
);

alter table tbl_order
    owner to ranork;

INSERT INTO public.tbl_order (id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES (5, 9, 1, 'LIMIT', 'TSLA', 12.34, 12.54, '2022-03-29 01:45:06.000000', null, false, 'TEST ORDER', null, 'BUY');
INSERT INTO public.tbl_order (id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES (2, 9, 1, 'LIMIT', 'TSLA', 1077, 1, '2022-03-27 15:04:53.000000', '2022-04-01 23:21:45.000000', false, null, null, 'SELL');
INSERT INTO public.tbl_order (id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES (7, 9, 1, 'LIMIT', 'TSLA', 1100, 4, '2022-04-01 23:39:36.000000', '2022-04-02 00:00:17.000000', false, 'TEST ORDER', 'COMPLETED', 'BUY');
INSERT INTO public.tbl_order (id, wallet, position, type, symbol, targetprice, amount, startdate, finishdate, active, explanation, endtype, bs) VALUES (6, 9, 1, 'LIMIT', 'TSLA', 1200, 1, '2022-04-01 23:23:34.000000', null, false, 'TEST ORDER', 'CANCELLED', 'SELL');
