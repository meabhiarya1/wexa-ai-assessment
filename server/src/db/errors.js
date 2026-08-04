export class DbUnavailableError extends Error {
  constructor(cause) {
    super("Could not reach CognoDB. The database may be paused, unreachable, or misconfigured.");
    this.name = "DbUnavailableError";
    this.cause = cause;
  }
}

export class DbConfigError extends Error {
  constructor(missingVars) {
    super(`Missing CognoDB environment variables: ${missingVars.join(", ")}.`);
    this.name = "DbConfigError";
    this.missingVars = missingVars;
  }
}
