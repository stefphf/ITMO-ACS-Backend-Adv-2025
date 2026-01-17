import { Response } from "express";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { Like } from "../models/Like";
import { LikeService } from "../services/LikeService";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam, Res, UseBefore } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { DeleteResponseDto, ErrorDto, ExistResponseDto, RecipeIdParamDto, UserIdParamDto } from "../dtos/GeneralDto";
import { LikeCreateDto, LikeIdParamDto, LikeResponseDto, LikeUpdateDto } from "../dtos/LikeDto";
import { toLikeCreateEntity, toLikeResponseDto, toLikeUpdateEntity } from "../utils/LikeUtils";

@OpenAPI({
    security: [{ bearerAuth: []}]
})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unauthorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/like")
export class LikeController extends BaseCRUDController<Like>{
    protected service: LikeService;

    constructor() {
        super(Like);
        this.service = new LikeService();
    }

    @OpenAPI({
        summary: "add new like"
    })
    @ResponseSchema(LikeResponseDto, {
        statusCode: 201,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Post("")
    async createLike(
        @Body({
            type: LikeCreateDto
        }) data: LikeCreateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toLikeCreateEntity(data)
        );
        const dto = toLikeResponseDto(entity);
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "get all likes"
    })
    @ResponseSchema(LikeResponseDto, {
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
    async getAllLikes(
        @QueryParam("recipe_id", {
            required: false,
            type: RecipeIdParamDto
        }) recipe_id: number,
        @QueryParam("user_id", {
            required: false,
            type: UserIdParamDto
        }) user_id: number,
        @Res() res: Response
    ): Promise<void> {
        if (!recipe_id && !user_id) {
            const entities = await super.getAllEntities();
            const dtos = entities.map((entity) => toLikeResponseDto(entity))
            res.json(dtos)
            return;
        }

        try {
            if (recipe_id && !user_id){
                const entities = await this.service.getAllByRecipeId(recipe_id);
                const dtos = entities.map((entity) => toLikeResponseDto(entity))
                res.json(dtos);
                return;
            } else if (!recipe_id && user_id) {
                const entities = await this.service.getAllByUserId(user_id);
                const dtos = entities.map((entity) => toLikeResponseDto(entity))
                res.json(dtos);
                return;
            } else {
                const entities = await this.service.isUserLikedRecipe(
                    user_id, recipe_id
                );
                res.json(entities as ExistResponseDto);
                return;
            }
        } catch (e) {
            res.status(400).json({message: "Invalid param"});
        }
    }


    @OpenAPI({
        summary: "get like by id"
    })
    @ResponseSchema(LikeResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation error"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Like not found"
    })
    @Get("/:like_id")
    async getRecipeIngredientById(
        @Params({
            type: LikeIdParamDto
        }) params: LikeIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(
            params.like_id
        );
        if (!entity) {
            res.status(404).json({detail: "Like not found"})
        }
        const dto = toLikeResponseDto(entity);
        res.status(200).json(dto)
    }

    @OpenAPI({
        summary: "update existed like"
    })
    @ResponseSchema(LikeResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Like not found"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Patch("/:like_id")
    async updateRecipeIngredient(
        @Params({
            type: LikeIdParamDto
        }) params: LikeIdParamDto,
        @Body({
            type: LikeUpdateDto
        }) data: LikeUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.like_id, toLikeUpdateEntity(data)
        );
        if (!entity) {
            res.status(404).json({detail: "Like not found"})
        }

        const dto = toLikeResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "delete like"
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
    @Delete("/:like_id")
    async deleteRecipeIngredient(
        @Params({
            type: LikeIdParamDto
        }) params: LikeIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(
            params.like_id
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