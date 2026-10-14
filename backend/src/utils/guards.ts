import { CredentialsDTO, NewUserDTO } from "../models/user.model.js";

/**
 * Type guards : fonctions qui vérifient à l'exécution qu'une valeur inconnue
 * (typiquement req.body ou req.params) a bien la forme attendue.
 * Si la fonction renvoie true, TypeScript considère la valeur comme du type indiqué.
 */

export function isNumber(obj: any): obj is number {
  return typeof obj === "number" && !isNaN(obj) && isFinite(obj);
}

export function isString(obj: any): obj is string {
  return typeof obj === "string";
}

export function isNonEmptyString(obj: any): obj is string {
  return isString(obj) && obj.trim().length !== 0;
}

export function isObject(obj: any): obj is object {
  return typeof obj === "object" && obj !== null;
}

// == USER ==

export function isNewUserDTO(obj: any): obj is NewUserDTO {
  return (
    isObject(obj) &&
    isNonEmptyString((obj as any).email) &&
    (obj as any).email.includes("@") &&
    isNonEmptyString((obj as any).password) &&
    isNonEmptyString((obj as any).username) 
  );
}

export function isCredentialsDTO(obj: any): obj is CredentialsDTO {
  return (
    isObject(obj) &&
    isNonEmptyString((obj as any).email) &&
    isNonEmptyString((obj as any).password)
  );
}
