import { NextFunction, Request, Response } from "express";
import express = require("express");
import services, { Service } from "./service/index";
import { Base } from "./service/Base";
const app = express();
const { PORT = 3000 } = process.env;

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const type = req.path.slice(1).toLowerCase();
  if (/^wb_[a-z\d]+\txt/.test(type)) {
    return res.send("open.weibo.com");
  }

  if (!services[type as keyof Service]) {
    return next();
  }

  const protocol = req.header("x-forwarded-proto") || "http";
  let host = req.header("x-forwarded-host") || req.hostname;

  if (host === "localhost") {
    host = `${host}:${PORT}`;
  }

  const service: Base = new services[type as keyof Service](
    req.query,
    protocol,
    host
  );

  const userInfo = await service.getUserInfo();
  if (typeof userInfo === "string") {
    return res.redirect(userInfo);
  }

  return res.send(userInfo);
});

app.listen(PORT);

export default app;
