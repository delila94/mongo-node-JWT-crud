import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util/secrets";

export class AuthController {

  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const tokenToSplit = req.headers.authorization.split(" ")
    const token = tokenToSplit[1]
    jwt.verify(token,JWT_SECRET, async function(err,decoded) {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: "error", code: "unauthorized", msg: err });
      }
      else {
        return next();
      }
      });
  }

}

