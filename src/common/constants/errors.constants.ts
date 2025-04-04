export const ERRORS = {
  API_NOT_FOUND: {
    key: 'API_NOT_FOUND',
    message: 'The requested API is not found',
  },
  BAD_REQUEST: {
    key: 'BAD_REQUEST',
    message: 'Invalid syntax for this request was provided',
  },
  NOT_FOUND: {
    key: 'NOT_FOUND',
    message: 'We could not find the resource you requested',
  },
  CONFLICT: {
    key: 'CONFLICT',
    message:
      'The request could not be completed due to a conflict with the current state of the resource',
  },
  GET_FAILED: {
    key: 'GET_FAILED',
    message: 'Failed to get the requested resources',
  },
  CREATE_FAILED: {
    key: 'CREATE_FAILED',
    message: 'Failed to create the requested resource',
  },
  UPDATE_FAILED: {
    key: 'UPDATE_FAILED',
    message: 'Failed to update the requested resource',
  },
  DELETE_FAILED: {
    key: 'DELETE_FAILED',
    message: 'Failed to delete the requested resource',
  },
};
