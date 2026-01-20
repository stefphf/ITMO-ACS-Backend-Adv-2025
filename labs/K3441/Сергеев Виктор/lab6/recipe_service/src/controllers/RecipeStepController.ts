import { RecipeStep } from "../models/RecipeStep";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { Response } from "express";
import { RecipeStepService } from "../services/RecipeStepService";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam, Res, UseBefore } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { ErrorDto, DeleteResponseDto } from "../dtos/GeneralDto";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RecipeStepCreateDto, RecipeStepIdParamDto, RecipeStepResponseDto, RecipeStepUpdateDto } from "../dtos/RecipeStepDto";
import { toRecipeStepCreateEntity, toRecipeStepResponseDto } from "../utils/RecipeStepUtils";
import { RecipeIdParamDto } from "../dtos/RecipeDto";

@OpenAPI({
    security: [{ bearerAuth: [] }]
})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unathorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/recipestep")
export class RecipeStepController extends BaseCRUDController<RecipeStep>{
    protected service: RecipeStepService;

    constructor () {
        super(RecipeStep);
        this.service = new RecipeStepService();
    }

    @OpenAPI({
        summary: "create new recipe step"
    })
    @ResponseSchema(RecipeStepResponseDto, {
        statusCode: 201,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Post("")
    async createRecipeStep(
        @Body({ type: RecipeStepCreateDto }) data: RecipeStepCreateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toRecipeStepCreateEntity(data)
        );
        const dto = toRecipeStepResponseDto(entity)
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "get all recipe steps",
    })
    @ResponseSchema(RecipeStepResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Get("")
    async getAllRecipeSteps(
        @QueryParam("recipe_id", {
            required: false,
            type: RecipeIdParamDto
        }) recipeId: number, 
        @Res() res: Response
    ): Promise<void> {
        if (!recipeId) {
            const entities = await super.getAllEntities();
            const dtos = entities.map((entity) => toRecipeStepResponseDto(entity));
            res.status(200).json(dtos);
            return;
        }

        try {
            const entities = await this.service.getAllByRecipeId(recipeId);
            const dtos = entities.map((entity) => toRecipeStepResponseDto(entity));
            res.json(dtos);
        } catch (e) {
            res.status(400).json({detail: "Invalid param"});
        }
    }

    @OpenAPI({
        summary: "get recipestep by id"
    })
    @ResponseSchema(RecipeStepResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation error"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "RecipeStep not found"
    })
    @Get("/:recipestep_id")
    async getRecipeStepById(
        @Params({
            type: RecipeStepIdParamDto
        }) params: RecipeStepIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(
            params.recipestep_id
        );
        if (!entity) {
            res.status(404).json({detail: "RecipeStep not found"})
        }
        const dto = toRecipeStepResponseDto(entity);
        res.status(200).json(dto)
    }

    @OpenAPI({
        summary: "update existed recipe"
    })
    @ResponseSchema(RecipeStepResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "RecipeStep not found"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "valudation failure"
    })
    @Patch("/:recipestep_id")
    async updateRecipe(
        @Params({
            type: RecipeStepIdParamDto
        }) params: RecipeStepIdParamDto,
        @Body({
            type: RecipeStepUpdateDto
        }) data: RecipeStepUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.recipestep_id, data
        );
        if (!entity) {
            res.status(404).json({detail: "RecipeStep not found"})
        }

        const dto = toRecipeStepResponseDto(entity);
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
    @Delete("/:recipestep_id")
    async deleteRecipe(
        @Params({
            type: RecipeStepIdParamDto
        }) params: RecipeStepIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(params.recipestep_id);
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