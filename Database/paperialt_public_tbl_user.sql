create table tbl_user
(
    username      varchar(50)  not null
        constraint tbl_user_pk
            primary key,
    password      varchar(120) not null,
    permlevel     integer default 0,
    lastlogindate date,
    lastloginip   varchar(100),
    registerdate  date,
    registerip    varchar(100),
    maxwallet     integer default 2,
    maxposition   integer default 5
);

alter table tbl_user
    owner to ranork;

INSERT INTO public.tbl_user (username, password, permlevel, lastlogindate, lastloginip, registerdate, registerip, maxwallet, maxposition) VALUES ('ranork2', '111', 0, '2022-03-23', '127.0.0.1', '2022-03-22', '127.0.0.1', 2, 5);
INSERT INTO public.tbl_user (username, password, permlevel, lastlogindate, lastloginip, registerdate, registerip, maxwallet, maxposition) VALUES ('ranork', '41d24f766f9cc9b781c6b7f32ddd6287', 100, '2022-03-24', '127.0.0.1', '2022-03-23', '127.0.0.1', 2, 5);
