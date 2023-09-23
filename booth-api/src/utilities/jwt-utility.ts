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
  public signToken(userId: string): string {
    const token = jwt.sign(userId, this.jwtSecretKey);
    return token;
  }

  /**
   * Verify token middleware.
   * @param req
   * @param resp
   * @param next
   * @ returns req.userId = subject;
   */
  public verifyJWTToken(bearerToken: string | undefined): string {
    if (!bearerToken) {
      throw new Error('unauthorized request-1');
    }

    const tokens = bearerToken.split(' ');
    if (tokens.length !== 2) {
        throw new Error('unauthorized request-2');
    }

    const token = tokens[1]
    const userId = jwt.verify(token, this.jwtSecretKey) as string;
    if (!userId) {
      throw new Error('unauthorized request-3');
    }

    return userId;
  }
}
