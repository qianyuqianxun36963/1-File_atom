/*==== create database my_suning; ====*/
use my_suning;

drop table if exists Org;

/*==============================================================*/
/* Table: Org                                                   */
/*==============================================================*/
create table Org
(
   orgid                varchar(10) not null,
   orgname              varchar(40),
   parentorgid          varchar(10),
   level                varchar(10),
   manager              varchar(20),
   linkman              varchar(20),
   linktel              varchar(20),
   primary key (orgid)
);

alter table Org comment '组织表';


drop table if exists User;

/*==============================================================*/
/* Table: User                                                  */
/*==============================================================*/
create table User
(
   userid               varchar(10) not null,
   name                 varchar(10),
   code                 varchar(10),
   phone                varchar(20),
   email                varchar(40),
   address              varchar(60),
   pwd                  varchar(20),
   primary key (userid)
);

alter table User comment '用户表，记录登录人信息';


drop table if exists orguser;

/*==============================================================*/
/* Table: orguser                                               */
/*==============================================================*/
create table orguser
(
   orguserid            varchar(10) not null,
   orgid                varchar(10),
   userid               varchar(10),
   primary key (orguserid)
);

alter table orguser comment '机构员工表';


drop table if exists userrole;

/*==============================================================*/
/* Table: userrole                                              */
/*==============================================================*/
create table userrole
(
   userroleid           varchar(10) not null,
   userid               varchar(10),
   roleid               varchar(10),
   primary key (userroleid)
);

alter table userrole comment '用户角色表';

drop table if exists Function;

/*==============================================================*/
/* Table: Function                                              */
/*==============================================================*/
create table Function
(
   funcid               varchar(10) not null,
   funcname             varchar(40),
   access               varchar(100),
   primary key (funcid)
);

alter table Function comment '功能表';


drop table if exists Role;

/*==============================================================*/
/* Table: Role                                                  */
/*==============================================================*/
create table Role
(
   roleid               varchar(10) not null,
   rolename             varchar(20),
   rolecode             varchar(20),
   primary key (roleid)
);

alter table Role comment '角色表';


drop table if exists rolefunc;

/*==============================================================*/
/* Table: rolefunc                                              */
/*==============================================================*/
create table rolefunc
(
   rolefuncid           varchar(10) not null,
   funcid               varchar(10),
   roleid               varchar(10),
   primary key (rolefuncid)
);

alter table rolefunc comment '角色-功能表';
