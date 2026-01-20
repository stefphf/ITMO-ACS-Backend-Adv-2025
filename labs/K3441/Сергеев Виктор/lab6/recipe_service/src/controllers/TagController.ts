import { Tag } from "../models/Tag";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { TagService } from "../services/TagService";
import { Response } from "express";
import { Body, Delete, Get, JsonController, Params, Patch, Post, Res, UseBefore } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ErrorDto, DeleteResponseDto } from "../dtos/GeneralDto";
import { TagCreateDto, TagIdParamDto, TagResponseDto, TagUpdateDto } from "../dtos/TagDto";
import { toTagCreateEntity, toTagResponseDto } from "../utils/TagUtils";

@OpenAPI({
    security: [{ bearerAuth: [] }]
})
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "unauthorized"
})
@UseBefore(AuthMiddleware)
@JsonController("/tag")
export class TagController extends BaseCRUDController<Tag>{
    protected service: TagService;
    
    constructor() {
        super(Tag);
        this.service = new TagService();
    }

    @OpenAPI({
        summary: "create new tag"
    })
    @ResponseSchema(TagResponseDto, {
        statusCode: 201,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Post("")
    async createTag(
        @Body({
            required: true,
            type: TagCreateDto
        }) data: TagCreateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.createEntity(
            toTagCreateEntity(data)
        );
        const dto = toTagResponseDto(entity)
        res.status(201).json(dto);
    }

    @OpenAPI({
        summary: "get all tags"
    })
    @ResponseSchema(TagResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @Get("")
    async getAllTags(
        @Res() res: Response
    ): Promise<void> {
        const entities = await super.getAllEntities();
        const dtos = entities.map((entity) => toTagResponseDto(entity));
        res.status(200).json(dtos);
    }
    
    @OpenAPI({
        summary: "get tag by id"
    })
    @ResponseSchema(TagResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Tag not found"
    })
    @ResponseSchema(Error, {
        statusCode: 400,
        description: "validation failure"
    })
    @Get("/:tag_id")
    async getTagById(
        @Params({
            type: TagIdParamDto
        }) params: TagIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(params.tag_id);
        if (!entity) {
            res.status(404).json({detail: "Tag not found"})
        }
        const dto = toTagResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "update existed tag"
    })
    @ResponseSchema(TagResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "Tag not found"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation failure"
    })
    @Patch("/:tag_id")
    async updateTag(
        @Params({
            type: TagIdParamDto
        }) params: TagIdParamDto,
        @Body({
            type: TagUpdateDto
        }) data: TagUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(
            params.tag_id, data
        )
        if (!entity) {
            res.status(404).json({detail: "Tag not found"});
        }
        const dto = toTagResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "delete tag"
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
    @Delete("/:tag_id")
    async deleteRecipe(
        @Params({
            type: TagIdParamDto
        }) params: TagIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(params.tag_id);
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