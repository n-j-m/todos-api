import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

export type ProblemDetail = {
  status?: number;
  title?: string;
  detail?: string;
  type?: string;
  instance?: string;
} & { [k: string]: any };

export function problem(
  status: number,
  title: string,
  detail?: string,
  type?: string,
  instance?: string,
  extra?: { [k: string]: any }
): ProblemDetail {
  let p = {
    status,
    type: type || "https://todos.example.com/problem",
    title,
    detail,
    instance,
  };

  if (extra) {
    p = { ...p, ...extra };
  }

  return p;
}

export function problemResponse(
  status: number,
  title: string,
  options?: ProblemExceptionOptions
): Response {
  const prob = problem(
    status,
    title,
    options?.detail,
    options?.type,
    options?.instance,
    { cause: options?.cause }
  );
  return new Response(JSON.stringify(prob), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export type ProblemExceptionOptions = {
  res?: Response;
  message?: string;
  cause?: unknown;
  detail?: string;
  type?: string;
  instance?: string;
};

export class ProblemException extends HTTPException {
  constructor(
    status: StatusCode,
    title: string,
    options?: ProblemExceptionOptions
  ) {
    super(status, {
      message: title,
      res: problemResponse(status, title, options),
      cause: options?.cause,
    });
  }
}

export class BadRequestException extends ProblemException {
  constructor(detail?: string, cause?: any) {
    super(400, "Bad Request", {
      type: ProblemTypes["Bad Request"],
      detail,
      cause,
    });
  }
}

export class UnauthorizedException extends ProblemException {
  constructor(detail?: string, cause?: any) {
    super(401, "Unauthorized", {
      type: ProblemTypes["Unauthorized"],
      detail,
      cause,
    });
  }
}

export class NotFoundException extends ProblemException {
  constructor(cause?: any) {
    super(404, "Not Found", { type: ProblemTypes["Not Found"], cause });
  }
}

export class InternalServerException extends ProblemException {
  constructor(detail?: string, cause?: any) {
    super(500, "Internal Server Error", {
      type: ProblemTypes["Internal Server Error"],
      detail,
      cause,
    });
  }
}

const baseProblemTypeUrl = "https://todos.example.com";

export const ProblemTypes = {
  "Bad Request": `${baseProblemTypeUrl}/bad_request`,
  Unauthorized: `${baseProblemTypeUrl}/unauthorized`,
  "Not Found": `${baseProblemTypeUrl}/not_found`,
  "Internal Server Error": `${baseProblemTypeUrl}/internal_server_error`,
};
