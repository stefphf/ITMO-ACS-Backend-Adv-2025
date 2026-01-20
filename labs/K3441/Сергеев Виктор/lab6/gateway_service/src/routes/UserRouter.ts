import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import SETTINGS from "../config/settings";

const userRouter = Router();
userRouter.use("/api/user", createProxyMiddleware({
    target: SETTINGS.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/user/'}
}))

userRouter.use("/api/register", createProxyMiddleware({
    target: SETTINGS.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/register/'}
}))

userRouter.use("/api/login", createProxyMiddleware({
    target: SETTINGS.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/login/'}
}))

userRouter.use("/api/dummyLogin", createProxyMiddleware({
    target: SETTINGS.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/dummyLogin/'}
}))

export default userRouter;