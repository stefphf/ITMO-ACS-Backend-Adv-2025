import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import SETTINGS from "../config/settings";
import axios from "axios";

const socialRouter = Router();

socialRouter.get("/api/like/user/:user_id", async (req, res) => {
    const likesResponse = await axios.get(
        `${SETTINGS.SOCIAL_SERVICE_URL}/api/like/?user_id=${req.params.user_id}`,
        {headers: {Authorization: req.header("Authorization")}}
    )
    const likesData = likesResponse.data
    const responseData = await Promise.all(likesData.map(async (entry) => {
        const recipeResponse = await axios.get(
            `${SETTINGS.RECIPE_SERVICE_URL}/api/recipe/${entry.recipe_id}`,
            {headers: {Authorization: req.header("Authorization")}}
        );
        return {
            id: entry.id,
            user_id: entry.user_id,
            recipe: recipeResponse.data
        }
    }))
    res.json(responseData)
})

socialRouter.get("/api/comment/recipe/:recipe_id", async (req, res) => {
    const commentsResponse = await axios.get(
        `${SETTINGS.SOCIAL_SERVICE_URL}/api/comment?recipe_id=${req.params.recipe_id}`,
        {headers: {Authorization: req.header("Authorization")}}
    )

    const commentsData = commentsResponse.data
    const responseData = await Promise.all(commentsData.map(async (entry) => {
        const userResponse = await axios.get(
            `${SETTINGS.USER_SERVICE_URL}/api/user/${entry.user_id}`,
            {headers: {Authorization: req.header("Authorization")}}
        )
        return {
            id: entry.id,
            recipe_id: entry.recipe_id,
            user: userResponse.data,
            comment: entry.comment,
            created_at: entry.created_at
        }
    }))
    res.json(responseData)
})

socialRouter.use("/api/like", createProxyMiddleware({
    target: SETTINGS.SOCIAL_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/like/'}
}))

socialRouter.use("/api/comment", createProxyMiddleware({
    target: SETTINGS.SOCIAL_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/comment/'}
}))

export default socialRouter;