const AppError = require("./../utils/appError");
const sendResponse = require("./../utils/sendResponse");

const allowedDataTypes = { string: true, object: true };
const validConditions = ["eq", "neq", "contains", "gt", "gte"];

exports.isPayloadValid = (req, res, next) => {
  if (!req.body.rule) return next(new AppError("rule is required.", 400));

  if (typeof req.body.rule !== "object")
    return next(new AppError("rule field should be an object.", 400));

  const ruleObjectRequiredFields = ["field", "condition", "condition_value"];
  const ruleObjectKeys = Object.keys(req.body.rule);
  const missingRuleFields = ruleObjectRequiredFields.filter(
    (item) => !ruleObjectKeys.includes(item)
  );
  if (missingRuleFields.length > 0) {
    return next(
      new AppError(`${missingRuleFields.join(", ")} is required.`, 400)
    );
  }

  if (validConditions.includes(req.body.rule.condition) === false) {
    return next(
      new AppError(
        `Invalid condition passed. condition must either be ${validConditions.join(
          ", "
        )}`,
        400
      )
    );
  }

  if (!req.body.data) return next(new AppError("data is required.", 400));
  if (
    Array.isArray(req.body.data) === false &&
    !allowedDataTypes[typeof req.body.data]
  ) {
    return next(
      new AppError(
        "invalid data type. data type must either be an array or a string or an object.",
        400
      )
    );
  }

  if (Object.keys(req.body).length !== 2) {
    return next(new AppError("Invalid JSON payload passed.", 400));
  }
  next();
};

exports.validateRule = (req, res, next) => {
  const ruleField = req.body.rule.field;
  const ruleCondition = req.body.rule.condition;
  const ruleConditionValue = req.body.rule.condition_value;
  let validationResult = null;
  if (ruleCondition === "contains") {
    validationResult = req.body.data.includes(ruleConditionValue);
    if (validationResult) {
      return sendResponse(
        {
          error: validationResult ? false : true,
          field: ruleField,
          field_value: req.body.data[ruleField],
          condition: ruleCondition,
          condition_value: ruleConditionValue,
        },
        res,
        `field ${ruleConditionValue} is in data`
      );
    } else {
      return next(new AppError(`field ${ruleField} is missing from data`, 400));
    }
  }
  if (ruleCondition === "eq") {
    validationResult = req.body.data[ruleField] === ruleConditionValue;
  } else if (ruleCondition === "neq") {
    validationResult = req.body.data[ruleField] !== ruleConditionValue;
  } else if (ruleCondition === "gte") {
    validationResult = req.body.data[ruleField] >= ruleConditionValue;
  } else if (ruleCondition === "gt") {
    validationResult = req.body.data[ruleField] > ruleConditionValue;
  }
  return sendResponse(
    {
      error: validationResult ? false : true,
      field: ruleField,
      field_value: req.body.data[ruleField],
      condition: ruleCondition,
      condition_value: ruleConditionValue,
    },
    res,
    `field ${ruleField} ${
      validationResult ? "successfully validated" : "failed validation"
    }`
  );
};
