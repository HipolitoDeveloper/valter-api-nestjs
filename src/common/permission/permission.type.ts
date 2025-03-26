import { ACTIONS, RESOURCES } from './permission.enum';

export type Resources = {
  [K in (typeof RESOURCES)[keyof typeof RESOURCES]]?: {
    [A in (typeof ACTIONS)[keyof typeof ACTIONS]]?: boolean;
  };
};
