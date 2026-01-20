import { BaseController } from "../common/BaseController";
import { Response } from "express";
import { User } from "../models/User";
import { checkPassword, hashPassword } from "../utils/AuthUtils";
import { UserService } from "../services/UserService";
import jwt = require("jsonwebtoken");
import SETTINGS from "../config/settings";
import { Body, Get, JsonController, Post, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { LoginUserDto, RegisterUserDto, TokenResponse, UserResponseDto } from "../dtos/UserDto";
import { toUserResponseDto } from "../utils/UserUtils";
import { ErrorDto } from "../dtos/GeneralDto";
import { sendUserLoggedMessage } from "../userMessageBroker";

@JsonController()
export class AuthController extends BaseController<User> {
    protected service: UserService;

    constructor () {
        super(User);
        this.service = new UserService();
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    @OpenAPI({summary: "register a new user"})
    @ResponseSchema(UserResponseDto, {
        statusCode: 201,
        description: "successful registration"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "registration failure"
    })
    @Post("/register")
    async register (
        @Body({ type: RegisterUserDto }) body: RegisterUserDto,
        @Res() res: Response
    ): Promise<void> {
        if (await this.service.getEntityByUsername(body.username)) {
            res.status(400).json({detail: "username already exists"});
            return;
        }

        const hash = hashPassword(body.password)
        const dto = {
            "username": body.username,
            "password": hash
        }
        try {
            const entity = await this.service.createEntity(dto);
            const responseDto = toUserResponseDto(entity);
            res.status(201).json(responseDto);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
    
    @OpenAPI({summary: "login in account"})
    @ResponseSchema(TokenResponse, {
        statusCode: 200,
        description: "login success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "login failure"
    })
    @Post("/login")
    async login (
        @Body({ type: LoginUserDto }) body: LoginUserDto,
        @Res() res: Response
    ) {
        const dto = {
            "username": body.username,
            "password": body.password
        };
        const user = await this.service.getEntityByUsername(dto.username);
        if (!user) {
            res.status(400).json({detail: "Username or password incorrect"} as ErrorDto)
            return;
        }

        if (!checkPassword(dto.password, user.password)) {
            res.status(400).json({detail: "Username or password incorrect"} as ErrorDto)
            return;
        }

        const accessToken = jwt.sign(
            {userId: user.id},
            SETTINGS.JWT_SECRET_KEY,
            {
                expiresIn: SETTINGS.JWT_ACCESS_TOKEN_LIFETIME,
            }
        );
        
        await sendUserLoggedMessage({
            userId: user.id,
            timestamp: new Date().toISOString()
        })
        
        res.status(200).json({access_token: accessToken} as TokenResponse);
        return;
    }

    @OpenAPI({summary: "login in developer account"})
    @ResponseSchema(TokenResponse, {
        statusCode: 200,
        description: "login success"
    })
    @ResponseSchema(ErrorDto, {
        statusCode: 400,
        description: "login failure"
    })
    @Get("/dummyLogin")
    async dummyLogin (
        @Res() res: Response
    ) {
        const dto = {
            "username": "developer",
            "password": "developer"
        };
        const user = await this.service.getEntityByUsername(dto.username);
        if (!user) {
            res.status(400).json({detail: "Username or password incorrect"} as ErrorDto)
            return;
        }

        if (!checkPassword(dto.password, user.password)) {
            res.status(400).json({detail: "Username or password incorrect"} as ErrorDto)
            return;
        }

        const accessToken = jwt.sign(
            {userId: user.id},
            SETTINGS.JWT_SECRET_KEY,
            {
                expiresIn: SETTINGS.JWT_ACCESS_TOKEN_LIFETIME,
            }
        );

        res.status(200).json({access_token: accessToken} as TokenResponse);
        return;
    }
}
