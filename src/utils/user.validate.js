import Joi from "joi";

const validateNewUserData = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
    return schema.validate(data)
}

const validateLoginData = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
    })
    return schema.validate(data)
}

export {
    validateNewUserData,
    validateLoginData
}