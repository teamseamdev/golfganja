import { permissions, roles } from "@/config/roles";

export type Role = (typeof roles)[number];

export type Permission = (typeof permissions)[number];
