create table users(
	id serial primary key,
	mail varchar,
	pass varchar,
	active boolean default false
);

create table favorite(
	pokemon int,
	user_id int,
	foreign key (user_id) references users (id),
	primary key (pokemon, user_id)
);
