export type TUser = {
  username: string;
  googleId: string;
  email: string;
  _id: string;
  token: string;
  password: string;
  avatar?: string;
};

export type TUserToken = {
  // userId: ;
  token: string;
  createdAt: Date;
};
