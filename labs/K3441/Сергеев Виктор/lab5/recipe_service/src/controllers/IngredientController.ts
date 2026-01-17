import { Response } from "express";
import { Ingredient } from "../models/Ingredient";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { IngredientService } from "../services/IngredientService";
import { Body, Delete, Get, JsonController, Params, Patch, Post, Res, UseBefore } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { ErrorDto, DeleteResponseDto } from "../dtos/GeneralDto";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { IngredientCreateDto, IngredientIdParamDto, IngredientResponseDto, IngredientUpdateDto } from "../dtos/IngredientDto";
import { toIngredientCreateEntity, toIngredientResponseDto } from "../utils/IngredientUtils";

@OpenAPI({
    security: [{ bearerAuth: [] }]
})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unauthorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/ingredient")
export class IngredientController extends BaseCRUDController<Ingredient>{
    protected service: IngredientService;

    constructor () {
        super(Ingredient);
        this.service = new IngredientService();
    }

    @OpenAPI({
        summary: "create new ingredient"
    })
    @ResponseSchema(IngredientResponseDto, {
        statusCode: 201,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Post("")
    async createIngredient(
        @Body({
            type: IngredientCreateDto
        }) data: IngredientCreateDto, 
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toIngredientCreateEntity(data)
        );
        const dto = toIngredientResponseDto(entity);
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "get all ingredients"
    })
    @ResponseSchema(IngredientResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @Get("")
    async getAllIngredients(
        @Res() res: Response
    ): Promise<void> {
        const entities = await super.getAllEntities();
        const dtos = entities.map((entity) => toIngredientResponseDto(entity));
        res.status(200).json(entities)
    }

    @OpenAPI({
        summary: "get ingredient by id"
    })
    @ResponseSchema(IngredientResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Ingredient not found"
    })
    @Get("/:ingredient_id")
    async getIngredientById(
        @Params({
            type: IngredientIdParamDto
        }) params: IngredientIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(
            params.ingredient_id
        )
        if (!entity) {
            res.status(404).json({detail: "Ingredient not found"})
        }
        const dto = toIngredientResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "update existed ingredient"
    })
    @ResponseSchema(IngredientResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Ingredient not found"
    })
    @Patch("/:ingredient_id")
    async updateIngredient(
        @Params({
            type: IngredientIdParamDto
        }) params: IngredientIdParamDto,
        @Body({type: IngredientUpdateDto}) data: IngredientUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.ingredient_id, data
        );
        if (!entity) {
            res.status(404).json({detail: "Ingredient not found"});
        }
        const dto = toIngredientResponseDto(entity);
        res.status(200).json(dto)
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
    @Delete("/:ingredient_id")
    async deleteIngredient(
        @Params({
            type: IngredientIdParamDto
        }) params: IngredientIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(params.ingredient_id);
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