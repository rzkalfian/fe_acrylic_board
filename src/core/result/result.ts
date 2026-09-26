/** A lightweight Either<Failure, Success> used across usecases/repositories. */
export type Result<L, R> = { kind: "left"; value: L } | { kind: "right"; value: R };

export const left = <L, R>(value: L): Result<L, R> => ({ kind: "left", value });
export const right = <L, R>(value: R): Result<L, R> => ({ kind: "right", value });

export const isRight = <L, R>(result: Result<L, R>): result is { kind: "right"; value: R } =>
  result.kind === "right";

export const isLeft = <L, R>(result: Result<L, R>): result is { kind: "left"; value: L } =>
  result.kind === "left";
