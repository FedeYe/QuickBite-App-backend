import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

// MUST DO for adding custom properties to "Request" in Typescript
declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

// for the "updateCurrentUser" funtion in controller
// -> we are extracting the auth0 identifier in order to find the user in our Database
// -> it's better to do these checks and operations in the middleware 
// in order to keep the code simple and easy to understand
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  // remember that the token is "Bearer sidnoanfoihafoi", it has a space
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  // will split the token at the blanck space " ", take the second item in the array [1]
  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    // "as string" bc i'm sure it will always exist and will be a string, otherwise typescript
    req.auth0Id = auth0Id as string;            
    req.userId = user._id.toString();
    // "next()" to tell the programm that we are done and it can move on to the next funtion
    next();
  } catch (error) {
    res.sendStatus(401);
    return;
  }
};
