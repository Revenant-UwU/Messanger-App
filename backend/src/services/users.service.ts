import type { NewUser, User } from '../models/user.model.js';
import { hashPassword } from '../utils/auth.js';
import { LoggerService } from './logger.service.js';
import * as userRepository from '../repositories/user.repository.js';

export class UsersService {
  static async getAll(): Promise<User[]> {
    return userRepository.findAll();
  }

  static async getById(id: number): Promise<User | undefined> {
    return userRepository.findById(id);
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    return userRepository.findByEmail(email);
  }

  static async getByUsername(
    username: string,
  ): Promise<User | undefined> {
    return userRepository.findByUsername(username);
  }

  static async searchUsers(query: string) {
    const search = query.trim().toLowerCase();

    if (search.length < 2) return [];

    return userRepository.searchUsersByUsername(search);
  }

  static async create(newUser: NewUser): Promise<User | undefined> {
    if (await this.getByEmail(newUser.email)) {
      LoggerService.error('Email already exists');
      return undefined;
    }

    if (await this.getByUsername(newUser.username)) {
      LoggerService.error('Username already in use');
      return undefined;
    }

    const hashedPassword = await hashPassword(newUser.password);

    try {
      return await userRepository.insert(
        newUser.username,
        newUser.email,
        hashedPassword,
      );
    } catch (error: unknown) {
      // Otra petición podría haber registrado los mismos datos
      // después de nuestras comprobaciones.
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === '23505'
      ) {
        LoggerService.error('Email or username already exists');
        return undefined;
      }

      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    return userRepository.deleteById(id);
  }
}