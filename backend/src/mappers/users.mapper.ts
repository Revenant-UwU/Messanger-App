import { NewUser, NewUserDTO, User, UserDBO, UserDTO, UserShortDTO } from "../models/user.model.js";

export class UsersMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static toShortDTO(user: User): UserShortDTO {
    return {
      id: user.id,
      username: user.username,
    };
  }

  static fromNewDTO(dto: NewUserDTO): NewUser {
    return {
      email: dto.email.trim().toLowerCase(),
      password: dto.password,
      username: dto.username.trim(),
    };
  }

  static toDBO(user: User): UserDBO {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
      role: user.role,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }

  static fromDBO(dbo: UserDBO): User {
    return {
      id: dbo.id,
      email: dbo.email,
      password: dbo.password,
      username: dbo.username,
      role: dbo.role,
      createdAt: new Date(dbo.created_at),
      updatedAt: new Date(dbo.updated_at),
    };
  }
}
