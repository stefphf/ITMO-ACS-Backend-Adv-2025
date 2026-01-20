import { Response } from "express";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { Comment } from "../models/Comment";
import { CommentService } from "../services/CommentService";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam, QueryParams, Res, UseBefore } from "routing-controllers";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { DeleteResponseDto, ErrorDto, RecipeIdParamDto, UserIdParamDto } from "../dtos/GeneralDto";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { CommentCreateDto, CommentIdParamDto, CommentResponseDto, CommentUpdateDto } from "../dtos/CommentDto";
import { toCommentCreateEntity, toCommentResponseDto, toCommentUpdateEntity } from "../utils/CommentUtils";

@OpenAPI({
    security: [{ bearerAuth: []}]
})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unauthorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/comment")
export class CommentController extends BaseCRUDController<Comment> {
    protected service: CommentService;

    constructor () {
        super(Comment);
        this.service = new CommentService();
    }

    @OpenAPI({
        summary: "add new comment"
    })
    @ResponseSchema(CommentResponseDto, {
        statusCode: 201,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Post("")
    async createComment(
        @Body({
            type: CommentCreateDto
        }) data: CommentCreateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toCommentCreateEntity(data)
        );
        const dto = toCommentResponseDto(entity);
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "get all comments"
    })
    @ResponseSchema(CommentResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Get("")
    async getAllComments(
        @QueryParam("recipe_id", {
            required: false,
            type: RecipeIdParamDto
        }) recipeId: number,
        @QueryParam("user_id", {
            required: false,
            type: UserIdParamDto
        }) userId: number,
        @Res() res: Response
    ): Promise<void> {
        if (!recipeId && !userId) {
            const entities = await super.getAllEntities();
            const dtos = entities.map((entity) => toCommentResponseDto(entity));
            res.status(200).json(dtos)
            return;
        }

        try {
            if (recipeId && !userId){
                const entities = await this.service.getAllByRecipeId(
                    recipeId
                );
                const dtos = entities.map((entity) => toCommentResponseDto(entity));
                res.json(dtos);
                return;
            } else if (!recipeId && userId) {
                const entities = await this.service.getAllByUserId(
                    userId
                );
                const dtos = entities.map((entity) => toCommentResponseDto(entity));
                res.json(dtos);
                return;
            } else {
                const entities = await this.service.getAllByIds(
                    userId, recipeId
                );
                const dtos = entities.map((entity) => toCommentResponseDto(entity));
                res.json(dtos);
                return;
            }
        } catch (e) {
            res.status(400).json({message: "Invalid param"});
        }
    }

    @OpenAPI({
        summary: "get comment by id"
    })
    @ResponseSchema(CommentResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation error"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Comment not found"
    })
    @Get("/:comment_id")
    async getRecipeIngredientById(
        @Params({
            type: CommentIdParamDto
        }) params: CommentIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(
            params.comment_id
        );
        if (!entity) {
            res.status(404).json({detail: "Comment not found"})
        }
        const dto = toCommentResponseDto(entity);
        res.status(200).json(dto)
    }

    @OpenAPI({
        summary: "update existed comment"
    })
    @ResponseSchema(CommentResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Comment not found"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Patch("/:comment_id")
    async updateRecipeIngredient(
        @Params({
            type: CommentIdParamDto
        }) params: CommentIdParamDto,
        @Body({
            type: CommentUpdateDto
        }) data: CommentUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.comment_id, toCommentUpdateEntity(data)
        );
        if (!entity) {
            res.status(404).json({detail: "Comment not found"})
        }

        const dto = toCommentResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "delete comment"
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
    @Delete("/:comment_id")
    async deleteRecipeIngredient(
        @Params({
            type: CommentIdParamDto
        }) params: CommentIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(
            params.comment_id
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