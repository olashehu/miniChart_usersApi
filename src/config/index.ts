import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

// validating environment variables
const schema = joi
  .object({
    NODE_ENV: joi.string().valid('development', 'production').required(),
    DBUSER: joi.string().required(),
    DBPASSWORD: joi.string().required(),
    DBPORT: joi.string().required(),
    DATABASE: joi.string().required(),
    HOST: joi.string().required(),
    PORT: joi.string().required(),
    DATABASE_LOGGING: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(false),
  })
  .unknown()
  .required();

const { error, value: envVars } = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  isDevelopment: envVars.NODE_ENV === 'development' ? true : false,
  isLocahost: envVars.NODE_ENV === 'development' ? true : false,
  NODE_ENV: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    port: envVars.DBPORT,
    host: envVars.HOST,
    username: envVars.DBUSER,
    password: envVars.DBPASSWORD,
    name: envVars.DATABASE,
    logging: envVars.DATABASE_LOGGING,
  },
};
