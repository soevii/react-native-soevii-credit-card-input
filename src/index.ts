import CV from './CardView/CardView'
import connectToState from './connectToState'
import CCF from './CreditCardInput'
import LiteCCF from './LiteCreditCardInput'

export const CreditCardInput = connectToState(CCF)
export const LiteCreditCardInput = connectToState(LiteCCF)
export const CardView = CV
