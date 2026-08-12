import { AppError } from "./error.middleware.js";

function formatIssues(issues) {
  return issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

export function validate(schemas = {}) {
  return (req, _res, next) => {
    const validated = {};

    for (const location of ["params", "query", "body"]) {
      const schema = schemas[location];
      if (!schema) continue;

      const result = schema.safeParse(req[location]);
      if (!result.success) {
        return next(
          new AppError(
            `Datos inválidos en ${location}`,
            400,
            formatIssues(result.error.issues)
          )
        );
      }

      validated[location] = result.data;
    }

    req.validated = validated;
    next();
  };
}
