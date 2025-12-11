import Joi from 'joi';

export const createComplaintSchema = Joi.object({
  crime_type: Joi.string().required(),
  description: Joi.string().required().min(10),
  amount: Joi.number().min(0).allow(null),
  location: Joi.object({
    state: Joi.string(),
    city: Joi.string(),
    address: Joi.string(),
  }).required(),
  is_anonymous: Joi.boolean().default(false),
});

export const updateComplaintSchema = Joi.object({
  description: Joi.string().min(10),
  amount: Joi.number().min(0),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('submitted', 'verified', 'under_investigation', 'fir_filed', 'closed', 'rejected')
    .required(),
  notes: Joi.string().allow(''),
});

