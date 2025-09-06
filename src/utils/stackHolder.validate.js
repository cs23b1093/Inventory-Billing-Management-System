import Joi from "joi";

const validateNewStakeHolder = (data) => {
  const schema = Joi.object({
    userId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        "string.empty": "User ID is required",
        "string.hex": "User ID must be a valid ObjectId",
        "string.length": "User ID must be 24 characters long",
        "any.required": "User ID is required",
      }),

    bussinessId: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.empty": "Business ID is required",
        "string.min": "Business ID must be at least 1 character",
        "string.max": "Business ID cannot exceed 100 characters",
        "any.required": "Business ID is required",
      }),

    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),

    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Please provide a valid phone number",
        "any.required": "Phone number is required",
      }),

    address: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        "string.empty": "Address is required",
        "string.min": "Address must be at least 10 characters",
        "string.max": "Address cannot exceed 500 characters",
        "any.required": "Address is required",
      }),

    type: Joi.string()
      .valid('customer', 'vendor', 'both')
      .default('customer')
      .messages({
        "any.only": "Type must be either 'customer', 'vendor', or 'both'",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateUpdateStakeHolder = (data) => {
  const schema = Joi.object({
    userId: Joi.string()
      .hex()
      .length(24)
      .optional()
      .messages({
        "string.hex": "User ID must be a valid ObjectId",
        "string.length": "User ID must be 24 characters long",
      }),

    bussinessId: Joi.string()
      .min(1)
      .max(100)
      .optional()
      .messages({
        "string.min": "Business ID must be at least 1 character",
        "string.max": "Business ID cannot exceed 100 characters",
      }),

    name: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
      }),

    email: Joi.string()
      .email()
      .optional()
      .messages({
        "string.email": "Please provide a valid email address",
      }),

    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .optional()
      .messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),

    address: Joi.string()
      .min(10)
      .max(500)
      .optional()
      .messages({
        "string.min": "Address must be at least 10 characters",
        "string.max": "Address cannot exceed 500 characters",
      }),

    type: Joi.string()
      .valid('customer', 'vendor', 'both')
      .optional()
      .messages({
        "any.only": "Type must be either 'customer', 'vendor', or 'both'",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export { 
  validateNewStakeHolder, 
  validateUpdateStakeHolder
};