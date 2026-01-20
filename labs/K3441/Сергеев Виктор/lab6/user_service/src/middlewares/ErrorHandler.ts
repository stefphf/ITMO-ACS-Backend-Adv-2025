import {
  ExpressErrorMiddlewareInterface,
  Middleware
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";

@Middleware({ type: "after", priority: 100 })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: NextFunction): void {
    // Проверка: если заголовки уже были отправлены, не трогаем ответ
    if (response.headersSent) {
      return;
    }

    const status = error.httpCode || 500;

    const result: any = {
      status,
      name: error.name || "InternalServerError",
      message: error.message || "Something went wrong",
    };

    // Валидационные ошибки от class-validator
    if (Array.isArray(error?.errors)) {
      result.errors = error.errors.map((e: any) => ({
        property: e.property, 
        constraints: e.constraints,
      }));
    }

    response.status(status).json(result);
  }
}