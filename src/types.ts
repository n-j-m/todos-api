import { getLucia } from "@/utils/get-lucia";
import { getDb } from "./db";
import { Session, User } from "lucia";

export type AppEnv = {
  D1: D1Database;
  APP_ENV: string;
  JWT_SECRET: string;
  CORS_ORIGINS: string;
};

export type AppDb = ReturnType<typeof getDb>;
export type AppLucia = ReturnType<typeof getLucia>;

export type AppVars = {
  db: AppDb;
  lucia: AppLucia;
};

export type AuthedAppVars = AppVars & { user: User; session: Session };

export type AppContext = {
  Bindings: AppEnv;
  Variables: AppVars;
};

export type AuthedAppContext = AppContext & {
  Variables: AuthedAppVars;
};

export type TodoListAppVars = AuthedAppVars & { listId: number };

export type TodoListContext = AuthedAppContext & {
  Variables: TodoListAppVars;
};
