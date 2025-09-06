import Joi from "joi";

const validateNewUserData = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 20 characters",
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
      }),

    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),

    password: Joi.string()
      .min(8)
      .max(64)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password cannot exceed 64 characters",
        "string.pattern.base":
          "Password must contain uppercase, lowercase, number, and special character",
        "any.required": "Password is required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateLoginData = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(20)
      .required()
      .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 20 characters",
      }),

    password: Joi.string()
      .min(8)
      .max(64)
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password cannot exceed 64 characters",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export { validateNewUserData, validateLoginData };
