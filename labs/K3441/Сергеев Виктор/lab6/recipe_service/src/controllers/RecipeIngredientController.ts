import { RecipeIngredient } from "../models/RecipeIngredient";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { RecipeIngredientService } from "../services/RecipeIngredientService";
import { Response } from "express";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam, Res, UseBefore } from "routing-controllers";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { ErrorDto, ExistResponseDto, DeleteResponseDto } from "../dtos/GeneralDto";
import { RecipeIngredientCreateDto, RecipeIngredientIdParamDto, RecipeIngredientResponseDto, RecipeIngredientUpdateDto } from "../dtos/RecipeIngredientDto";
import { toRecipeIngredientCreateEntity, toRecipeIngredientResponseDto, toRecipeIngredientUpdateEntity } from "../utils/RecipeIngredientUtils";
import { IngredientIdParamDto } from "../dtos/IngredientDto";
import { RecipeIdParamDto } from "../dtos/RecipeDto";

@OpenAPI({
    security: [{ bearerAuth: []}]
})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unauthorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/recipeingredient")
export class RecipeIngredientController
    extends BaseCRUDController<RecipeIngredient> {
    protected service: RecipeIngredientService;

    constructor() {
        super(RecipeIngredient);
        this.service = new RecipeIngredientService();
    }

    @OpenAPI({
        summary: "add new recipe ingredient"
    })
    @ResponseSchema(RecipeIngredientResponseDto, {
        statusCode: 201,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Post("")
    async createRecipeIngredient(
        @Body({
            type: RecipeIngredientCreateDto
        }) data: RecipeIngredientCreateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toRecipeIngredientCreateEntity(data)
        );
        const dto = toRecipeIngredientResponseDto(entity);
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "get all recipe ingredients"
    })
    @ResponseSchema(RecipeIngredientResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ExistResponseDto, {
        statusCode: 200,
        description: "existence of the object"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Get("")
    async getAllRecipeIngrediensts(
        @QueryParam("recipe_id", {
            required: false,
            type: RecipeIdParamDto
        }) recipeId: number,
        @QueryParam("ingredient_id", {
            required: false,
            type: IngredientIdParamDto
        }) ingredientId: number,
        @Res() res: Response
    ): Promise<void> {
        if (!recipeId && !ingredientId) {
            const entities = await super.getAllEntities();
            const dtos = entities.map((entity) => toRecipeIngredientResponseDto(entity));
            res.status(200).json(dtos);
            return;
        }

        try {
            if (recipeId && !ingredientId){
                const entities = await this.service.getAllByRecipeId(recipeId);
                const dtos = entities.map((entity) => toRecipeIngredientResponseDto(entity));
                res.json(dtos);
                return;
            } else if (!recipeId && ingredientId) {
                const entities = await this.service.getAllByIngredientId(ingredientId);
                const dtos = entities.map((entity) => toRecipeIngredientResponseDto(entity));
                res.json(dtos);
                return;
            } else {
                const entities = await this.service.isIngredientInRecipe(
                    ingredientId, recipeId
                );
                res.json(entities as ExistResponseDto);
                return;
            }
        } catch (e) {
            res.status(400).json({message: "Invalid param"});
        }
    }

    @OpenAPI({
        summary: "get recipe ingredient by id"
    })
    @ResponseSchema(RecipeIngredientResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation error"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "RecipeIngredient not found"
    })
    @Get("/:recipeingredient_id")
    async getRecipeIngredientById(
        @Params({
            type: RecipeIngredientIdParamDto
        }) params: RecipeIngredientIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(
            params.recipeingredient_id
        );
        if (!entity) {
            res.status(404).json({detail: "RecipeIngredient not found"})
        }
        const dto = toRecipeIngredientResponseDto(entity);
        res.status(200).json(dto)
    }

    @OpenAPI({
        summary: "update existed recipe ingredient"
    })
    @ResponseSchema(RecipeIngredientResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "RecipeIngredient not found"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Patch("/:recipeingredient_id")
    async updateRecipeIngredient(
        @Params({
            type: RecipeIngredientIdParamDto
        }) params: RecipeIngredientIdParamDto,
        @Body({
            type: RecipeIngredientUpdateDto
        }) data: RecipeIngredientUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.recipeingredient_id, toRecipeIngredientUpdateEntity(data)
        );
        if (!entity) {
            res.status(404).json({detail: "RecipeIngredient not found"})
        }

        const dto = toRecipeIngredientResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "delete recipe ingredient"
    })
    @ResponseSchema(DeleteResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validaiton failure"
    })
    @ResponseSchema(DeleteResponseDto, {
        statusCode: 400,
        description: "failure"
    })
    @Delete("/:recipeingredient_id")
    async deleteRecipeIngredient(
        @Params({
            type: RecipeIngredientIdParamDto
        }) params: RecipeIngredientIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(
            params.recipeingredient_id
        );
        let statusCode: number;
        if (result) {
            statusCode = 200;
        } else {
            statusCode = 400;
        }
        res.status(statusCode).json(
            {success: result} as DeleteResponseDto
        )
    }
}