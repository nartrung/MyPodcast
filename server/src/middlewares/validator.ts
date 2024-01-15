import { RequestHandler } from "express";
import * as yup from "yup";

export const validate = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body) return res.status(422).json({ error: "Empty Body!!" });
    const SchemaToValidate = yup.object({
      body: schema,
    });

    try {
      await SchemaToValidate.validate(
        {
          body: req.body,
        },
        {
          abortEarly: true,
        }
      );
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(403).json({ error: error.message });
      }
    }
  };
};
