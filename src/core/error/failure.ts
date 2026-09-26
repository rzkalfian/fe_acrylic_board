/** Represents a domain-level failure returned by usecases/repositories. */
export class Failure {
  readonly message: string;
  readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
