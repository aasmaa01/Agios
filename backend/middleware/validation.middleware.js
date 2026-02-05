const validateRequest = (schema) => {
    return (req, res, next) => {
        if (!schema) return next();
        
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }
        next();
    };
};

export { validateRequest };