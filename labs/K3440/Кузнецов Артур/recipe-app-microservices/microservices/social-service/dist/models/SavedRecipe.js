"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedRecipe = void 0;
const typeorm_1 = require("typeorm");
/**
 * @openapi
 * components:
 *   schemas:
 *     SavedRecipe:
 *       type: object
 *       required:
 *         - id
 *         - created_at
 *         - userId
 *         - recipeId
 *       properties:
 *         id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: integer
 *         recipeId:
 *           type: integer
 */
let SavedRecipe = class SavedRecipe {
};
exports.SavedRecipe = SavedRecipe;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SavedRecipe.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], SavedRecipe.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], SavedRecipe.prototype, "recipeId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SavedRecipe.prototype, "created_at", void 0);
exports.SavedRecipe = SavedRecipe = __decorate([
    (0, typeorm_1.Index)('IDX_saved_user_recipe', ['userId', 'recipeId'], { unique: true }),
    (0, typeorm_1.Entity)()
], SavedRecipe);
