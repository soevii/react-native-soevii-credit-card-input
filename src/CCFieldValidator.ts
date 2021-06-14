import valid from 'card-validator'
import every from 'lodash.every'
import pick from 'lodash.pick'
import values from 'lodash.values'

const toStatus = (validation: any) => {
  return validation.isValid
    ? 'valid'
    : validation.isPotentiallyValid
    ? 'incomplete'
    : 'invalid'
}

const FALLBACK_CARD = { gaps: [4, 8, 12], lengths: [16], code: { size: 3 } }
export default class CCFieldValidator {
  private _displayedFields: any
  private _validatePostalCode: any
  constructor(displayedFields: any, validatePostalCode: any) {
    this._displayedFields = displayedFields
    this._validatePostalCode = validatePostalCode
  }

  validateValues = (formValues: any) => {
    const numberValidation = valid.number(formValues.number)
    const expiryValidation = valid.expirationDate(formValues.expiry)
    const maxCVCLength = (numberValidation.card || FALLBACK_CARD).code.size
    const cvcValidation = valid.cvv(formValues.cvc, maxCVCLength)

    const validationStatuses = pick(
      {
        number: toStatus(numberValidation),
        expiry: toStatus(expiryValidation),
        cvc: toStatus(cvcValidation),
        name: formValues.name ? 'valid' : 'incomplete',
        postalCode: this._validatePostalCode(formValues.postalCode),
      },
      this._displayedFields
    )

    return {
      valid: every(values(validationStatuses), (status) => status === 'valid'),
      status: validationStatuses,
    }
  }
}