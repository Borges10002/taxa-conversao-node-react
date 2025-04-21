export class IdAlreadyExists extends Error {
  constructor() {
    super("id already exists");
  }
}
