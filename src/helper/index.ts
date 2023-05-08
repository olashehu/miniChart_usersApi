import { HttpException, HttpStatus } from '@nestjs/common';

export const handleErrorCatch = (err) => {
    if (
      err.status === HttpStatus.NOT_FOUND ||
      err.status === HttpStatus.BAD_REQUEST ||
      err.status === HttpStatus.UNAUTHORIZED
    ) {
      throw new HttpException(
        {
          status: err.status,
          error: err.response.error,
        },
        err.status,
      );
    }
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `An error occured with the message: ${err.message}`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
};
