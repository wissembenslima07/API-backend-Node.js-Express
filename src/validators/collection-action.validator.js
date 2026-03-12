const Joi = require("joi");
const { COLLECTION_ACTION_TYPES } = require("../models/collection-action.model");

const objectIdSchema = Joi.string().hex().length(24).required();

const createCollectionActionSchema = Joi.object({
  client: objectIdSchema,
  invoice: Joi.string().hex().length(24).optional(),
  type: Joi.string()
    .valid(...COLLECTION_ACTION_TYPES)
    .required(),
  actionDate: Joi.date().iso().optional(),
  result: Joi.string().trim().allow("").max(250).optional(),
  comment: Joi.string().trim().allow("").max(1000).optional(),
});

function validateCollectionActionCreation(payload) {
  return createCollectionActionSchema.validate(payload, { abortEarly: false });
}

function validateObjectId(id) {
  return objectIdSchema.validate(id);
}

module.exports = {
  validateCollectionActionCreation,
  validateObjectId,
};
