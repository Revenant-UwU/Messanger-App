import { Response, Router } from "express";
import { UsersMapper } from "../mappers/users.mapper.js";
import { AuthenticatedRequest } from "../models/auth.model.js";
import { ERole, UserDTO, UserShortDTO } from "../models/user.model.js";
import { AuthService } from "../services/auth.service.js";
import { LoggerService } from "../services/logger.service.js";
import { UsersService } from "../services/users.service.js";

export const usersController = Router();

/**
 * GET /users
 * Tous les utilisateurs (admin uniquement)
 */
usersController.get("/", AuthService.authorize, AuthService.isAdmin, (req: AuthenticatedRequest, res: Response) => {
  LoggerService.info("[GET] /users");

  const users = UsersService.getAll();
  const usersDTO: UserDTO[] = [];
  for (const user of users) {
    usersDTO.push(UsersMapper.toDTO(user));
  }
  return res.status(200).json(usersDTO);
});


/**
 * GET /users/:id
 * Un utilisateur : informations complètes pour soi-même ou un admin, publiques sinon
 */
usersController.get("/:id", AuthService.authorize, (req: AuthenticatedRequest, res: Response) => {
  LoggerService.info("[GET] /users/:id");

  if (!req.user) return res.sendStatus(401);
  const currentUser = req.user;

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);

  const user = UsersService.getById(id);
  if (!user) return res.sendStatus(404);

  if (currentUser.id === user.id || currentUser.role === ERole.ADMIN) {
    const userDTO: UserDTO = UsersMapper.toDTO(user);
    return res.status(200).json(userDTO);
  }
  const userShortDTO: UserShortDTO = UsersMapper.toShortDTO(user);
  return res.status(200).json(userShortDTO);
});

/**
 * DELETE /users/:id
 * Supprime un utilisateur (admin uniquement, pas soi-même)
 */
usersController.delete("/:id", AuthService.authorize, AuthService.isAdmin, (req: AuthenticatedRequest, res: Response) => {
  LoggerService.info("[DELETE] /users/:id");

  if (!req.user) return res.sendStatus(401);
  const currentUser = req.user;

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (id === currentUser.id) return res.sendStatus(400);

  if (!UsersService.getById(id)) return res.sendStatus(404);

  if (!UsersService.delete(id)) return res.sendStatus(500);

  return res.sendStatus(204);
});
