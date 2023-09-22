import * as jwt from 'jsonwebtoken';

export class JWTUtility {

private jwtSecretKey: string = '';

  constructor(jwt_secret: string) {
    this.jwtSecretKey = jwt_secret;
}

  /**
   * Return the encrypted data.
   * @param userId The value to encrypt
   */
  public signToken(payload: jwt.JwtPayload): string {
    const token = jwt.sign(payload, this.jwtSecretKey);
    return token;
  }

  /**
   * Verify token middleware.
   * @param req
   * @param resp
   * @param next
   * @ returns req.userId = subject;
   */
  public verifyJWTToken(bearerToken: string | undefined): jwt.JwtPayload {
    if (!bearerToken) {
      throw new Error('unauthorized request-1');
    }

    const tokens = bearerToken.split(' ');
    if (tokens.length !== 2) {
        throw new Error('unauthorized request-2');
    }

    const token = tokens[1]
    const user = jwt.verify(token, this.jwtSecretKey) as jwt.JwtPayload;
    if (!user) {
      throw new Error('unauthorized request-3');
    }

    return user;
  }
}
