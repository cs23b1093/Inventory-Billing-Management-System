import Joi from "joi";

const validateNewTransition = (data) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid('sale', 'purchase')
      .required()
      .messages({
        "any.only": "Type must be either 'sale' or 'purchase'",
        "any.required": "Type is required",
      }),

    customerId: Joi.string()
      .when('type', {
        is: 'sale',
        then: Joi.required().messages({
          "any.required": "Customer ID is required",
        }),
        otherwise: Joi.forbidden().messages({
          "any.unknown": "Customer ID is not allowed for purchase transactions",
        }),
      }),

    vendorId: Joi.string()
      .when('type', {
        is: 'purchase',
        then: Joi.required().messages({
          "any.required": "Vendor ID is required",
        }),
        otherwise: Joi.forbidden().messages({
          "any.unknown": "Vendor ID is not allowed for sales transactions",
        }),
      }),

    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string()
            .required()
            .messages({
              "string.empty": "Product ID is required",
              "any.required": "Product ID is required",
            }),
          quantity: Joi.number()
            .positive()
            .integer()
            .required()
            .messages({
              "number.positive": "Quantity must be a positive number",
              "number.base": "Quantity must be a number",
              "any.required": "Quantity is required",
            }),
          price: Joi.number()
            .positive()
            .required()
            .messages({
              "number.positive": "Price must be a positive number",
              "number.base": "Price must be a number",
              "any.required": "Price is required",
            }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one product is required",
        "any.required": "Products is required",
      }),

    date: Joi.date()
      .max('now')
      .default(() => new Date())
      .messages({
        "date.max": "Date cannot be in the future",
        "date.base": "Date must be a valid date",
      }),

    businessId: Joi.string()
      .required()
      .messages({
        "string.empty": "Business ID is required",
        "any.required": "Business ID is required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateTransactionUpdate = (data) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid('sale', 'purchase')
      .messages({
        "any.only": "Type must be either 'sale' or 'purchase'",
      }),

    customerId: Joi.string()
      .when('type', {
        is: 'sale',
        then: Joi.required().messages({
          "any.required": "Customer ID is required for sales transactions",
        }),
        otherwise: Joi.forbidden().messages({
          "any.unknown": "Customer ID is not allowed for purchase transactions",
        }),
      }),

    vendorId: Joi.string()
      .when('type', {
        is: 'purchase',
        then: Joi.required().messages({
          "any.required": "Vendor ID is required for purchase transactions",
        }),
        otherwise: Joi.forbidden().messages({
          "any.unknown": "Vendor ID is not allowed for sales transactions",
        }),
      }),

    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string()
            .required()
            .messages({
              "string.empty": "Product ID is required",
              "any.required": "Product ID is required",
            }),
          quantity: Joi.number()
            .positive()
            .integer()
            .required()
            .messages({
              "number.positive": "Quantity must be a positive number",
              "number.base": "Quantity must be a number",
              "any.required": "Quantity is required",
            }),
          price: Joi.number()
            .positive()
            .required()
            .messages({
              "number.positive": "Price must be a positive number",
              "number.base": "Price must be a number",
              "any.required": "Price is required",
            }),
        })
      )
      .min(1)
      .messages({
        "array.min": "At least one product is required",
      }),

    date: Joi.date()
      .max('now')
      .messages({
        "date.max": "Date cannot be in the future",
        "date.base": "Date must be a valid date",
      }),

    businessId: Joi.string()
      .messages({
        "string.empty": "Business ID cannot be empty",
      }),
  }).min(1).messages({
    "object.min": "At least one field must be provided for update",
  });

  return schema.validate(data, { abortEarly: false });
};

export { validateNewTransition, validateTransactionUpdate };