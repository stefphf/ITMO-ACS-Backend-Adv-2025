import { Response } from "express";
import { BaseCRUDController } from "../common/BaseCRUDController";
import { AuthMiddleware, AuthRequest } from "../middlewares/AuthMiddleware";
import { User } from "../models/User";
import { Body, Delete, Get, JsonController, Params, Patch, Req, Res, UseBefore } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { UserIdParamDto, UserResponseDto, UserUpdateDto } from "../dtos/UserDto";
import { ErrorDto, DeleteResponseDto } from "../dtos/GeneralDto";
import { toUserResponseDto } from "../utils/UserUtils";

@OpenAPI( { security: [{ bearerAuth: [] }] } )
@ResponseSchema(ErrorDto, {
    statusCode: 401,
    description: "authroization failure"
})
@UseBefore(AuthMiddleware)
@JsonController("/user")
export class UserController extends BaseCRUDController<User> {
    constructor () {
        super(User);
        this.getMe = this.getMe.bind(this);
    }

    @OpenAPI({summary: "get all users"})
    @ResponseSchema(UserResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @Get("")
    async getAllUsers(
        @Res() res: Response
    ): Promise<void> {
        const entities = await super.getAllEntities();
        const dtos = entities.map((entity) => toUserResponseDto(entity))
        res.status(200).json(dtos);
    }

    @OpenAPI({summary: "get current user information"})
    @ResponseSchema(UserResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "user not found"
    })
    @Get("/me")
    async getMe (
        @Req() req: AuthRequest,
        @Res() res: Response
    ): Promise<void> {
        const user_id = req.user?.userId;
        if (!user_id) {
            // check if this block reachable
            res.status(401).json({detail: "Unauthorized"})
            return;
        }
        const user = await this.service.getEntityById(user_id);
        if (!user) {
            res.status(404).json({detail: "User not found"});
            return;
        }

        const dto = toUserResponseDto(user);

        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "get user by id"
    })
    @ResponseSchema(UserResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 404,
        description: "user not found"
    })
    @Get('/:user_id')
    async getUserById(
        @Params({type: UserIdParamDto}) params: UserIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.getEntityById(params.user_id);
        if (!entity) {
            res.status(404).json({detail: "User not found"})
            return;
        }
        const dto = toUserResponseDto(entity);
        res.status(200).json(dto);
        return;
    }

    @OpenAPI({
        summary: "update user information"
    })
    @ResponseSchema(UserResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "validation error"
    })
    @Patch("/:user_id")
    async updateUser(
        @Params({type: UserIdParamDto}) params: UserIdParamDto,
        @Body({type: UserUpdateDto}) data: UserUpdateDto,
        @Res() res: Response
    ): Promise<void> {
        const entity = await super.updateEntity(params.user_id, data);
        if (!entity) {
            res.status(404).json({detail: "User not found"});
            return;
        }
        const dto = toUserResponseDto(entity);
        res.status(200).json(dto);
    }

    @OpenAPI({
        summary: "delete user by id"
    })
    @ResponseSchema(DeleteResponseDto, {
        statusCode: 200,
        description: "success"
    })
    @ResponseSchema(DeleteResponseDto, {
        statusCode: 400,
        description: "failure"
    })
    @Delete("/:user_id")
    async deleteUser(
        @Params({type: UserIdParamDto}) params: UserIdParamDto,
        @Res() res: Response
    ): Promise<void> {
        const result = await super.deleteEntity(params.user_id);
        let statusCode: number;
        if (result) {
            statusCode = 200;
        } else {
            statusCode = 400;
        }
        res.status(statusCode).json({success: result} as DeleteResponseDto)
        return;
    }
}