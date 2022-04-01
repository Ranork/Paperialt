create table tbl_wallet
(
    -- varchar can not be auto increment
    id             serial
        constraint tbl_wallet_pk
            primary key,
    name           varchar(120)     default 'Unnamed Wallet'::character varying,
    username       varchar(50) not null,
    startbalance   double precision default 100,
    currentbalance double precision default 100,
    isprivate      boolean          default false,
    createdate     timestamp,
    explanation    varchar(200)
);

alter table tbl_wallet
    owner to ranork;

INSERT INTO public.tbl_wallet (id, name, username, startbalance, currentbalance, isprivate, createdate, explanation) VALUES ('9', 'Unnamed Wallet', 'ranork', 5000, 5009.64, false, '2022-03-26 02:10:14.000000', null);
