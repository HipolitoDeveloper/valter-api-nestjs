import { CurrentUser } from '../../modules/user/user.type';
import { Request as ExpressRequest } from 'express';

export type TResponse<T> = {
  data?: T;
  error: boolean;
  error_message: string;
};

export type Request = ExpressRequest & {
  currentUser: CurrentUser;
  cache?: any;
};
