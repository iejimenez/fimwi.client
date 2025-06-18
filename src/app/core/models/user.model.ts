export interface User {
  id: string;
  username: string;
  email: string;
  roleId: string;
  role: {
    id: string;
    name: string;
  };
  emailConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
} 