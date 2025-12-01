import Joi from 'joi';

const userinfoSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(0).optional()
});

const verifyNewUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|net)$')).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref('password')
}).with('password', 'confirmPassword');

function validateUserinfo(Schema,source = 'body'){
    return (req, res, next) => {
        const dataToValidate = req[source];
        const { error, value } = Schema.validate(dataToValidate);
        if (error) {
            const details = error.details.map(d => d.message);
            return res.status(400).json({ 
                message: 'Validation error',
                errors: details });
        }
        req[source] = value;
        next();
    };
}



export { validateUserinfo, userinfoSchema, verifyNewUserSchema };
