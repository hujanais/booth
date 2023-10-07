import * as jwt from 'jsonwebtoken';

export class JWTUtility {

  private jwtSecretKey: string = '';

  constructor(jwt_secret: string) {
    this.jwtSecretKey = jwt_secret;
  }

  /**
   * Return the encrypted data.
   * @param sessionId The value to encrypt
   */
  public signToken(sessionId: string): string {
    const token = jwt.sign(sessionId, this.jwtSecretKey);
    return token;
  }

  /**
   * Verify token middleware.
   * @param bearerToken 'Bearer XXXXX'
   * @ returns sessionId
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
    const sessionId = jwt.verify(token, this.jwtSecretKey) as string;
    if (!sessionId) {
      throw new Error('unauthorized request-3');
    }

    return sessionId;
  }

  /**
   * Decodes jwtToken to sessionId
   * @param token jwtToken
   * @returns sessionId
   */
  public decodeJWTToken(token: string): string {
    const sessionId = jwt.verify(token, this.jwtSecretKey) as string;
    if (!sessionId) {
      throw new Error('unauthorized request-3');
    }
    return sessionId;
  }
}
