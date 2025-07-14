import { USER_ROLE_ENUM, USER_STATUS_ENUM } from '../enums/user.enum';

export type UserRole = (typeof USER_ROLE_ENUM)[number]; // "admin" | "user"
export type UserStatus = (typeof USER_STATUS_ENUM)[number]; // "active" | "inactive"
