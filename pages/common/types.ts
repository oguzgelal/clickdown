export type TTeam = {
  id: string;
  members: TMember[];
  name: string;
};

export type TFolder = {
  id: string;
  orderindex: number;
  name: string;
  statuses: TStatus[];
  lists: TList[];
  hidden: boolean;
  archived: boolean;
};

export type TSpace = {
  id: string;
  name: string;
  statuses: TStatus[];
};

export type TStatus = {
  id: string;
  color: string;
  orderIndex: number;
  status: string;
  type: string;
};

export type TList = {
  id: string;
  name: string;
  orderindex: number;
  statuses: TStatus[];
  folder?: TFolder;
  archived: boolean;
  start_date?: string;
};

export type TMember = {
  user: TUser;
  invited_by: TUser;
};

export type TUser = {
  id: number;
  color: string;
  initials: string;
  username: string;
  profilePicture?: string;
};
