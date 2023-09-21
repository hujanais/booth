import { NextFunction, Request, Response  } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('### something ran')
    res.status(500).send('Internal Server Error');
  }