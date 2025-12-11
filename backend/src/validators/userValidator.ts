import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  name: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('citizen', 'police', 'admin').default('citizen'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/),
  is_active: Joi.boolean(),
});

