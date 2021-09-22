create table note_notes.user
(
    id bigint not null
        auto_increment primary key,
    name varchar(255) null
);

create table note_notes.notation
(
    id bigint not null
        auto_increment primary key,
    description varchar(255) null
);
