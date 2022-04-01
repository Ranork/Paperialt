create table tbl_position
(
    id          serial
        constraint tbl_position_pk
            primary key,
    walletid    integer                                       not null,
    type        varchar(50) default 'LONG'::character varying not null,
    startorder  integer     default 0,
    endorder    integer     default 0,
    market      varchar(50)                                   not null,
    symbol      varchar(100)                                  not null,
    totalusd    double precision                              not null,
    totalstock  double precision                              not null,
    createdate  timestamp                                     not null,
    isprivate   boolean     default false,
    active      boolean     default true,
    explanation varchar(200),
    finishpnl   double precision
);

alter table tbl_position
    owner to ranork;

INSERT INTO public.tbl_position (id, walletid, type, startorder, endorder, market, symbol, totalusd, totalstock, createdate, isprivate, active, explanation, finishpnl) VALUES (1, 9, 'SHORT', 0, 0, 'NASDAQ', 'TSLA', 9.640000000000327, 0, '2022-03-27 15:03:32.000000', false, false, null, 9.640000000000327);
