import { Response } from "express";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { RecipeTag } from "../models/RecipeTag";
import { RecipeTagService } from "../services/RecipeTagService";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { DeleteResponseDto, ErrorDto, ExistResponseDto } from "../dtos/GeneralDto";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam, Res, UseBefore } from "routing-controllers";
import { RecipeTagCreateDto, RecipeTagIdParamDto, RecipeTagResponseDto, RecipeTagUpdateDto } from "../dtos/RecipeTagDto";
import { toRecipeTagCreateEntity, toRecipeTagResponseDto, toRecipeTagUpdateEntity } from "../utils/RecipeTagUtils";
import { RecipeIdParamDto } from "../dtos/RecipeDto";
import { TagIdParamDto } from "../dtos/TagDto";

@OpenAPI({
    security: [{ bearerAuth: []}]
})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unauthorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/recipetag")
export class RecipeTagController
    extends BaseCRUDController<RecipeTag>{

    protected service: RecipeTagService;
    
    constructor () {
        super(RecipeTag);
        this.service = new RecipeTagService();
    }

    @OpenAPI({
        summary: "add new recipe tag"
    })
    @ResponseSchema(RecipeTagResponseDto, {
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
            type: RecipeTagCreateDto
        }) data: RecipeTagCreateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toRecipeTagCreateEntity(data)
        );
        const dto = toRecipeTagResponseDto(entity);
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "get all recipe tags"
    })
    @ResponseSchema(RecipeTagResponseDto, {
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
    async getAllRecipeTags(
        @QueryParam("recipe_id", {
            required: false,
            type: RecipeIdParamDto
        }) recipeId: number,
        @QueryParam("tag_id", {
            required: false,
            type: TagIdParamDto
        }) tagId: number,
        @Res() res: Response
    ): Promise<void> {
        if (!recipeId && !tagId) {
            const entities = await super.getAllEntities();
            const dtos = entities.map((entity) => toRecipeTagResponseDto(entity));
            res.status(200).json(dtos)
            return;
        }

        try {
            if (recipeId && !tagId){
                const entities = await this.service.getAllByRecipeId(recipeId);
                const dtos = entities.map((entity) => toRecipeTagResponseDto(entity));
                res.json(dtos);
                return;
            } else if (!recipeId && tagId) {
                const entities = await this.service.getAllByTagId(tagId);
                const dtos = entities.map((entity) => toRecipeTagResponseDto(entity));
                res.json(dtos);
                return;
            } else {
                const entities = await this.service.isRecipeHasTag(
                    tagId, recipeId
                );
                res.json(entities as ExistResponseDto);
                return;
            }
        } catch (e) {
            res.status(400).json({message: "Invalid param"});
        }
    }

    @OpenAPI({
        summary: "get recipe tag by id"
    })
    @ResponseSchema(RecipeTagResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation error"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "RecipeTag not found"
    })
    @Get("/:recipetag_id")
    async getRecipeTagById(
        @Params({
            type: RecipeTagIdParamDto
        }) params: RecipeTagIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(
            params.recipetag_id
        );
        if (!entity) {
            res.status(404).json({detail: "RecipeTag not found"})
        }
        const dto = toRecipeTagResponseDto(entity);
        res.status(200).json(dto)
    }

    @OpenAPI({
        summary: "update existed recipe tag"
    })
    @ResponseSchema(RecipeTagResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "RecipeTag not found"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Patch("/:recipetag_id")
    async updateRecipeTag(
        @Params({
            type: RecipeTagIdParamDto
        }) params: RecipeTagIdParamDto,
        @Body({
            type: RecipeTagUpdateDto
        }) data: RecipeTagUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.recipetag_id, toRecipeTagUpdateEntity(data)
        );
        if (!entity) {
            res.status(404).json({detail: "RecipeTag not found"})
        }

        const dto = toRecipeTagResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "delete recipe tag"
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
    @Delete("/:recipetag_id")
    async deleteRecipe(
        @Params({
            type: RecipeTagIdParamDto
        }) params: RecipeTagIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(
            params.recipetag_id
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