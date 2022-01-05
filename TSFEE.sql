use TSFEE;
create table Feedback(
	id int auto_increment,
    userName nvarchar(255),
    phone nvarchar(255),
    school nvarchar(255),
    created_at datetime,
    primary key(id)
);

create table Media(
	id int auto_increment,
    mediaURL text,
    created_at datetime,
    primary key(id)
);

alter table Media add userCreateID int;
alter table Media add foreign key(userCreateID) references auth_user(id);