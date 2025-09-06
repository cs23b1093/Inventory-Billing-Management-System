import Joi from "joi";

const validateNewProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least 2 characters",
        "string.max": "Product name cannot exceed 100 characters",
      }),

    slug: Joi.string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required()
      .messages({
        "string.empty": "Slug is required",
        "string.pattern.base":
          "Slug must be lowercase, alphanumeric, and may contain hyphens",
      }),

    description: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 10 characters",
        "string.max": "Description cannot exceed 500 characters",
      }),

    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be greater than 0",
        "any.required": "Price is required",
      }),

    stock: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": "Stock must be a number",
        "number.integer": "Stock must be an integer",
        "number.min": "Stock cannot be negative",
        "any.required": "Stock is required",
      }),

    category: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Category is required",
        "string.min": "Category must be at least 3 characters",
        "string.max": "Category cannot exceed 50 characters",
      }),

    businessId: Joi.string()
      .hex()
      .length(24) 
      .required()
      .messages({
        "string.empty": "Business ID is required",
        "string.hex": "Business ID must be a valid ObjectId",
        "string.length": "Business ID must be 24 characters long",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export { validateNewProduct };
