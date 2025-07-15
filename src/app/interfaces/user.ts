import { UserRole, UserStatus } from '../../utils/types/user.type';

export interface User {
  // Unique ID
  id?: string;
  // Base Info
  firstName: string;
  lastName: string;
  picture?: string;
  // Authentication Info
  status?: UserStatus;
  role?: UserRole;
  // Security Info
  createdAt?: Date | string;
  lastUpdateAt?: Date | string | undefined;
  lastLogin?: Date | string | undefined;
  lastAllowedIp?: string | undefined;
  allowedIps?: string[] | undefined;
}
