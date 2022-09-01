interface DomainErrorProps {
  message: string;
}

export abstract class DomainError implements DomainErrorProps {
  public readonly message: string;
  public readonly extra?: any;

  constructor(message: string, extra?: any) {
    this.message = message;
    this.extra = extra;
  }
}
