import { NextRequest } from "next/server";

export type ErrorObject = {
  code?: number;
  message?: string;
  redirect?: URL;
};

function _getErrorMessage(response: Response, errorMessage?: string) {
  return errorMessage
    ? `Error: ${errorMessage}. ${response.statusText}. Error code: ${response.status}`
    : `Error: ${response.statusText}. Error code: ${response.status}`;
}

function badRequest(response: Response, errorMessage?: string) {
  const error = {
    code: 400,
    message: "Bad request. Please try again.",
  };
  console.error(
    _getErrorMessage(
      response,
      errorMessage ? `${error.message} ${errorMessage}` : error.message,
    ),
  );
  return error;
}

function unauthorized(
  response: Response,
  request: NextRequest,
  errorMessage?: string,
) {
  const error = {
    code: 401,
    message: "Authorization failed. Check token expiration.",
    redirect: new URL("/login?auth=failed", request.url),
  };
  console.error(
    _getErrorMessage(
      response,
      errorMessage ? `${error.message} ${errorMessage}` : error.message,
    ),
  );
  return error;
}

function forbidden(response: Response, errorMessage?: string) {
  const error = {
    code: 403,
    message: "Forbidden. Please try again.",
  };
  console.error(
    _getErrorMessage(
      response,
      errorMessage ? `${error.message} ${errorMessage}` : error.message,
    ),
  );
  return error;
}

function timeout(response: Response, errorMessage?: string) {
  const error = {
    code: 504,
    message: "Request timed out. Please try again.",
  };
  console.error(
    _getErrorMessage(
      response,
      errorMessage ? `${error.message} ${errorMessage}` : error.message,
    ),
  );
  return error;
}

export default async function errorHandler(
  request: NextRequest,
  response: Response,
  errorMessage?: string,
): Promise<ErrorObject> {
  if (response.status === 400) return badRequest(response, errorMessage);
  if (response.status === 401)
    return unauthorized(response, request, errorMessage);
  if (response.status === 403) return forbidden(response, errorMessage);
  if (response.status === 504) return timeout(response, errorMessage);

  const error = _getErrorMessage(response, errorMessage);
  throw new Error(error);
}
