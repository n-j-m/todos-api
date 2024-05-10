import { AuthedAppContext } from "@/types";
import { initApp } from "@/utils/app-factory";
import { UnauthorizedException } from "@/utils/problem";
import { createFactory } from "hono/factory";
import { decode } from "hono/jwt";

export function authorize<C extends AuthedAppContext = AuthedAppContext>() {
  const factory = createFactory<C>({ initApp });
  const m = factory.createMiddleware(async (c, next) => {
    const { lucia } = c.var;

    const header = c.req.header("authorization");
    if (!header) {
      throw new UnauthorizedException();
    }

    const token = lucia.readBearerToken(header);
    if (!token) {
      throw new UnauthorizedException();
    }

    const jwtToken = decode(token);

    const sessionId = jwtToken.payload.aud;
    if (!sessionId) {
      throw new UnauthorizedException();
    }

    const { user, session } = await lucia.validateSession(sessionId);

    if (!user || !session || session.expiresAt.getDate() >= Date.now()) {
      throw new UnauthorizedException();
    }

    c.set("user", user);
    c.set("session", session);

    await next();
  });
  return m;
}

// export const authorize = factory.createMiddleware(async (c, next) => {
//   const { lucia } = c.var;

//   const header = c.req.header("authorization");
//   if (!header) {
//     throw new UnauthorizedException();
//   }

//   const token = lucia.readBearerToken(header);
//   if (!token) {
//     throw new UnauthorizedException();
//   }

//   const jwtToken = decode(token);

//   const sessionId = jwtToken.payload.aud;
//   if (!sessionId) {
//     throw new UnauthorizedException();
//   }

//   const { user, session } = await lucia.validateSession(sessionId);

//   if (!user || !session || session.expiresAt.getDate() >= Date.now()) {
//     throw new UnauthorizedException();
//   }

//   c.set("user", user);
//   c.set("session", session);

//   await next();
// });
