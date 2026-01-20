import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import SETTINGS from "../config/settings";

const axios = require('axios')
const recipeRouter = Router();

recipeRouter.use("/api/recipe/filter", createProxyMiddleware({
    target: SETTINGS.RECIPE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/recipe/filter'}
}))

recipeRouter.get("/api/recipe/:id", async (req, res) => {
    try {
        const recipeResponse = await axios.get(
            `${SETTINGS.RECIPE_SERVICE_URL}/api/recipe/${req.params.id}`,
            {headers: {Authorization: req.header("Authorization")}}
        )
        let recipe = recipeResponse.data

        const authorResponse = await axios.get(
            `${SETTINGS.USER_SERVICE_URL}/api/user/${recipe.author_id}`,
            {headers: {Authorization: req.header("Authorization")}}
        )
        
        recipe.author = authorResponse.data
        res.json(recipe)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

recipeRouter.use("/api/recipe", createProxyMiddleware({
    target: SETTINGS.RECIPE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/recipe/'}
}))

recipeRouter.use("/api/tag", createProxyMiddleware({
    target: SETTINGS.RECIPE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/tag/'}
}))

recipeRouter.use("/api/ingredient", createProxyMiddleware({
    target: SETTINGS.RECIPE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/ingredient/'}
}))

recipeRouter.use("/api/recipetag", createProxyMiddleware({
    target: SETTINGS.RECIPE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/recipetag/'}
}))

recipeRouter.use("/api/recipeingredient", createProxyMiddleware({
    target: SETTINGS.RECIPE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/recipeingredient/'}
}))

recipeRouter.use("/api/recipestep", createProxyMiddleware({
    target: SETTINGS.RECIPE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/': '/api/recipestep/'}
}))

export default recipeRouter;