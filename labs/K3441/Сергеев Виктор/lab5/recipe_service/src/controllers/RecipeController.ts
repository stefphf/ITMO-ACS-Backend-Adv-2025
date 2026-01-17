import { Response } from "express";
import { Recipe } from "../models/Recipe";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { RecipeService } from "../services/RecipeService";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam, Res, UseBefore } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { ErrorDto, DeleteResponseDto, UserIdParamDto } from "../dtos/GeneralDto";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RecipeCreateDto, RecipeIdParamDto, RecipeResponseDto, RecipeUpdateDto } from "../dtos/RecipeDto";
import { toRecipeCreateEntity, toRecipeResponseDto } from "../utils/RecipeUtils";
import { TagIdParamDto } from "../dtos/TagDto";

@OpenAPI( {security: [
    {bearerAuth: []}
]})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unauthorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/recipe")
export class RecipeController extends BaseCRUDController<Recipe>{
    protected service: RecipeService;

    constructor() {
        super(Recipe);
        this.service = new RecipeService();
    }
    
    @OpenAPI({
        summary: "create new recipe"
    })
    @ResponseSchema(RecipeResponseDto, {
        statusCode: 201,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Post("")
    async createRecipe(
        @Body({type: RecipeCreateDto}) data: RecipeCreateDto, 
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toRecipeCreateEntity(data)
        );
        const dto = toRecipeResponseDto(entity);
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "Get all recipes",
    })
    @ResponseSchema(RecipeResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Get("")
    async getAllRecipes (
        @QueryParam("author_id", {
            required: false,
            type: UserIdParamDto
        }) authorId: number,
        @Res() res: Response
    ): Promise<void> {
        if (!authorId) {
            const entities = await super.getAllEntities();
            const dtos = entities.map((entity) => toRecipeResponseDto(entity));
            res.status(200).json(dtos);
        }

        try {
            const entities = await this.service.getAllByAuthorId(authorId);
            const dtos = entities.map((entity) => toRecipeResponseDto(entity));
            res.json(dtos);
        } catch (e) {
            res.status(400).json({detail: "Invalid param"});
        }
    }

    @OpenAPI({
        summary: "Get all recipes filtred by tag_id and title",
    })
    @ResponseSchema(RecipeResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Get("/filter")
    async getFilteredByTagAndTitle (
        @QueryParam("tag_id", {
            required: false,
            type: TagIdParamDto
        }) tagId: number,
        @QueryParam("title", {
            required: false,
            type: String
        }) title: string,
        @Res() res: Response,
    ): Promise<void> {
        if (!title && !tagId) {
            const entities = await super.getAllEntities();
            const dtos = entities.map((entity) => toRecipeResponseDto(entity));
            res.status(200).json(dtos);
            return;
        }

        try {
            if (title && !tagId){
                const entities = await this.service.getFilteredByTitle(title);
                const dtos = entities.map((entity) => toRecipeResponseDto(entity));
                res.json(dtos);
                return;
            } else if (!title && tagId) {
                const entities = await this.service.getFilteredByTag(tagId);
                const dtos = entities.map((entity) => toRecipeResponseDto(entity));
                res.json(dtos);
                return;
            } else {
                const entities = await this.service.getFilteredByTagAndTitle(title, tagId);
                const dtos = entities.map((entity) => toRecipeResponseDto(entity));
                res.json(dtos);
                return;
            }
        } catch (e) {
            res.status(400).json({message: "Invalid param"});
        }
    }

    @OpenAPI({
        summary: "get recipe by id"
    })
    @ResponseSchema(RecipeResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation error"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Recipe not found"
    })
    @Get("/:recipe_id")
    async getRecipeById(
        @Params({type: RecipeIdParamDto}) params: RecipeIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(params.recipe_id);
        if (!entity) {
            res.status(404).json({detail: "Recipe not found"})
        }
        const dto = toRecipeResponseDto(entity);
        res.status(200).json(dto)
    }

    @OpenAPI({
        summary: "update existed recipe"
    })
    @ResponseSchema(RecipeResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Recipe not found"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "valudation failure"
    })
    @Patch("/:recipe_id")
    async updateRecipe(
        @Params({type: RecipeIdParamDto}) params: RecipeIdParamDto,
        @Body({type: RecipeUpdateDto}) data: RecipeUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.recipe_id, data
        );
        if (!entity) {
            res.status(404).json({detail: "Recipe not found"})
        }

        const dto = toRecipeResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "delete recipe"
    })
    @ResponseSchema(DeleteResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @ResponseSchema(DeleteResponseDto, {
        statusCode: 400,
        description: "failure"
    })
    @Delete("/:recipe_id")
    async deleteRecipe(
        @Params({type: RecipeIdParamDto}) params: RecipeIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(params.recipe_id);
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