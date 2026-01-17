import { env } from 'process';
import { randomBytes } from 'crypto';

class Settings {
    // application base settings
    APP_HOST: string = env.APP_HOST || 'localhost';
    APP_PORT: number = parseInt(env.APP_PORT) || 3000;
    APP_PROTOCOL: string = env.APP_PROTOCOL || 'http';
    APP_API_PREFIX: string = env.APP_API_PREFIX || '/api';
    USER_SERVICE_URL = env.USER_SERVICE_URL || 'http://localhost:3001'
    RECIPE_SERVICE_URL = env.RECIPE_SERVICE_URL || 'http://localhost:3002'
    SOCIAL_SERVICE_URL = env.SOCIAL_SERVICE_URL || 'http://localhost:3003'
}

const SETTINGS = new Settings();

export default SETTINGS;