import { UsersMapper } from "../mappers/users.mapper.js";
import { ERole, NewUser, User, UserDBO } from "../models/user.model.js";
import { hashPassword } from "../utils/auth.js";
import { AbstractService } from "./abstract.service.js";
import { LoggerService } from "./logger.service.js";

export class UsersService extends AbstractService {
  protected static dbPath: string = "data/users.json";

  private static readUsersDB(): User[] {
    return UsersService.readDB<UserDBO, User>(UsersMapper.fromDBO);
  }

  private static writeUsersDB(users: User[]): boolean {
    return UsersService.writeDB<User, UserDBO>(users, UsersMapper.toDBO);
  }

  /**
   * Tous les utilisateurs
   */
  static getAll(): User[] {
    return this.readUsersDB();
  }

  /**
   * Un utilisateur par son id, ou undefined s'il n'existe pas
   */
  static getById(id: number): User | undefined {
    const users = this.readUsersDB();
    for (const user of users) {
      if (user.id === id) {
        return user;
      }
    }
    return undefined;
  }

  /**
   * Un utilisateur par son email (insensible à la casse), ou undefined s'il n'existe pas
   */
  static getByEmail(email: string): User | undefined {
    const users = this.readUsersDB();
    for (const user of users) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  /**
   * Crée un utilisateur (rôle "user" par défaut).
   * @returns l'utilisateur créé, ou undefined si l'email est déjà utilisé
   */
  static async create(newUser: NewUser): Promise<User | undefined> {
    const users = this.readUsersDB();

    if (this.getByEmail(newUser.email)) {
      LoggerService.error("Email already exists: " + newUser.email);
      return undefined;
    }
    const hashedPassword = await hashPassword(newUser.password);

    const user: User = {
      id: UsersService.getNextId(users),
      email: newUser.email,
      password: hashedPassword, // stocké tel quel... pour l'instant
      username: newUser.username,
      role: ERole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(user);
    if (!this.writeUsersDB(users)) {
      return undefined;
    }
    return user;
  }

  /**
   * Supprime un utilisateur.
   * @returns true si supprimé, false s'il n'existait pas
   */
  static delete(id: number): boolean {
    const users = this.readUsersDB();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return this.writeUsersDB(users);
  }

}
