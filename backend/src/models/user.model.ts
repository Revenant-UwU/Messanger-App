import { BasicModel, BasicModelDBO, BasicModelDTO } from "./mm.model.js";

export enum ERole {
  USER = "user",
  ADMIN = "admin",
}

/** Utilisateur dans le code métier */
export interface User extends BasicModel {
  email: string;
  password: string;
  username: string;
  role: ERole;
}

/** Données nécessaires à la création d'un utilisateur (inscription) */
export interface NewUser {
  email: string;
  password: string;
  username: string;
}

/** Forme stockée dans data/users.json */
export interface UserDBO extends BasicModelDBO {
  email: string;
  password: string;
  username: string;
  role: ERole;
}

/** Utilisateur renvoyé par l'API (jamais le mot de passe !) */
export interface UserDTO extends BasicModelDTO {
  email: string;
  username: string;
  role: ERole;
}

/** Informations publiques d'un utilisateur (ex : auteur d'une recette) */
export interface UserShortDTO {
  id: number;
  username: string;
}

/** Corps de POST /auth/register */
export interface NewUserDTO {
  email: string;
  password: string;
  username: string;
}

/** Corps de POST /auth/login */
export interface CredentialsDTO {
  email: string;
  password: string;
}

/** Réponse de POST /auth/register et POST /auth/login */
export interface TokenDTO {
  token: string;
}

export interface TokenPayload {
id: number;
email: string;
role: "user" | "admin";
}
