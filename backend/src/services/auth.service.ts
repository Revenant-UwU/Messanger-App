import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../models/auth.model.js";
import { ERole, User, TokenPayload } from "../models/user.model.js";
import { generateFakeToken, generateToken, validateFakeToken, verifyToken } from "../utils/auth.js";
import { LoggerService } from "./logger.service.js";
import { UsersService } from "./users.service.js";
import bcrypt from "bcrypt"; 

export class AuthService {
  /**
   * Vérifie les identifiants.
   * @returns un token si l'email et le mot de passe sont corrects, undefined sinon
   */
  static async login(email: string, password: string): Promise<string | undefined> {
    const user = UsersService.getByEmail(email);
    if (!user) return undefined;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return undefined; // Mot de passe incorrect

    return generateToken({
      "id": user.id,
      "email": user.email,
      "role": user.role
    });
  }

  /**
   * Middleware : vérifie le token du header Authorization et place l'utilisateur dans req.user.
   * Répond 401 si le token est absent ou invalide.
   */
  static authorize(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.get("Authorization");
    if (!token) {
      LoggerService.error("Missing Authorization header");
      return res.sendStatus(401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log("Token rejeté");
      return res.sendStatus(401);
    }
    req.user = payload; // disponible dans les middlewares et routes suivants
    next();
  }

  /**
   * Middleware (à placer après authorize) : n'autorise que les administrateurs.
   * Répond 403 sinon.
   */
  static isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.sendStatus(403);
    next();
  }
}
