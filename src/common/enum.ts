export const ERRORS = {
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  VALIDATION_ERROR: 'validation.error',
  DATABASE_ERROR: 'database.thrown.an.error',
  INTEGRATION_ERROR: 'integration.error',
  NOT_FOUND_ENTITY: 'database.not.found.entity',
  CREATE_ENTITY_ERROR: 'database.thrown.an.error.while.entity.was.created',
  UPDATE_ENTITY_ERROR: 'database.thrown.an.error.while.entity.was.updated',
  DELETE_ENTITY_ERROR: 'database.thrown.an.error.while.entity.was.deleted',
  UNPROCESSABLE_CONTENT: 'entity.was.not.processed',
  CUSTOM_ERROR: {
    BUSINESS_PARTNER: {
      NOT_FOUND_HIERARCHY_CODE: 'business_partner.dont.have.hierarchy.code',
      BLOCKED_TENANT: 'business_partner.is.blocked',
    },
    PROGRAM: {
      NO_BUSINESS_PARTNER_ATTACHED:
        'program.dont.have.business.partner.attached',
    },
    USER: {
      MISMATCH_PASSWORD: 'user.has.a.mismatch.password',
      ALREADY_CREATED_USER: 'user.already.exists',
      BLOCKED_USER: 'user.is.blocked',
      CREATED_USER: 'user.is.created',
    },
    TRAVEL: {
      OCURRENCE_NOT_CREATED: 'ocurrence.not.created',
    },
    OCURRENCE: {
      SOME_OCURRENCES_ARE_ALREADY_ON_APPROVED_STATUS:
        'some.ocurrences.are.already.on.approved.status',
      OCURRENCE_IS_ALREADY_ON_APPROVED_STATUS:
        'ocurrence.is.already.on.approved.status',
    },
  },
};

export const PROFILES = {
  ADMINISTRATOR: 'administrator',
  USER: 'user',
};

export const ERROR_ENTITY_KEYS = {
  BUSINESS_PARTNER: 'business_partner',
};

export const CACHE_KEYS = {
  PROGRAM: 'program',
};
