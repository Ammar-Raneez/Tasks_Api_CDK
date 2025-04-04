import { Request, Response, NextFunction } from 'express';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';

import { ERRORS } from '../constants';
import { HTTPSTATUS } from '../enums';
import { cbError } from '../handler';

function createAjvInstance() {
  const ajv = new Ajv();
  ajvFormats(ajv);

  ajv.addFormat('date', {
    type: 'string',
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });

  ajv.addFormat('time', {
    type: 'string',
    validate: /^\d{2}:\d{2}$/,
  });

  ajv.addFormat('year', {
    type: 'string',
    validate: /^(19|20)\d{2}$/,
  });

  ajv.addFormat('month', {
    type: 'string',
    validate: /^(0[1-9]|1[0-2])$/,
  });

  ajv.addFormat('iso-timestamp', {
    type: 'string',
    validate: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z?$/,
  });

  return ajv;
}

export function ValidateRequest(
  schema: object,
): (req: Request, res: Response, next: NextFunction) => void {
  const ajv = createAjvInstance();

  return (req: Request, res: Response, next: NextFunction) => {
    const isValid = ajv.validate(schema, req.body);

    if (!isValid || Object.keys(req.body).length === 0) {
      return cbError(
        res,
        HTTPSTATUS.BAD_REQUEST,
        ERRORS.BAD_REQUEST,
        ajv.errorsText(ajv.errors, { separator: '\n' }),
      );
    }

    next();
  };
}
