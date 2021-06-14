import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Dimensions,
  findNodeHandle,
  NativeModules,
  ScrollView,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native'

import CreditCard from './CardView/CardView'
import CCInput from './CCInput'
import { InjectedProps } from './connectToState'
import { ICreditCardInputs, IInputPlaceholders } from './types'

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  form: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  inputContainer: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: 'bold',
  },
  input: {
    height: 40,
  },
})

const CVC_INPUT_WIDTH = 70
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get('window').width * 0.5
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH
const PREVIOUS_FIELD_OFFSET = 40
const POSTAL_CODE_INPUT_WIDTH = 120

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component<ICreditCardInputs> {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    // inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,
    scrollViewProps: PropTypes.object,
  }

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: 'NAME',
      number: 'CARD NUMBER',
      expiry: 'EXPIRY',
      cvc: 'CVC/CCV',
      postalCode: 'POSTAL CODE',
    },
    placeholders: {
      name: 'Full name',
      number: '1234 5678 1234 5678',
      expiry: 'MM/YY',
      cvc: 'CVC',
      postalCode: '34567',
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    validColor: '',
    invalidColor: 'red',
    placeholderColor: 'gray',
    allowScroll: false,
    additionalInputsProps: {},
  }

  componentDidMount = () => this._focus(this.props.focused)

  componentDidUpdate(prevProps: any) {
    if (prevProps.focused !== this.props.focused)
      this._focus(this.props.focused)
  }

  _focus = (field: any) => {
    if (!field) return
    const refs: any = this.refs
    const scrollResponder = refs.Form.getScrollResponder()
    const nodeHandle = findNodeHandle(refs[field])

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      (e: any) => {
        throw e
      },
      (x: any) => {
        scrollResponder.scrollTo({
          x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0),
          animated: true,
        })
        refs[field].focus()
      }
    )
  }

  _inputProps = (field: any) => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props

    const result: IInputPlaceholders = {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    }

    return result
  }

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type },
      focused,
      placeholderCardView,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
      scrollViewProps,
    } = this.props

    return (
      <View style={s.container}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          placeholder={placeholderCardView}
          name={requiresName ? name : ' '}
          number={number}
          expiry={expiry}
          cvc={cvc}
        />
        <ScrollView
          ref='Form'
          horizontal
          keyboardShouldPersistTaps='always'
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={s.form}
          {...scrollViewProps}
        >
          {requiresName && (
            <CCInput
              {...this._inputProps('name')}
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: NAME_INPUT_WIDTH },
              ]}
            />
          )}
          <CCInput
            {...this._inputProps('number')}
            keyboardType='numeric'
            containerStyle={[
              s.inputContainer,
              inputContainerStyle,
              { width: CARD_NUMBER_INPUT_WIDTH },
            ]}
          />
          <CCInput
            {...this._inputProps('expiry')}
            keyboardType='numeric'
            containerStyle={[s.inputContainer, inputContainerStyle]}
          />
          {requiresCVC && (
            <CCInput
              {...this._inputProps('cvc')}
              keyboardType='numeric'
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: CVC_INPUT_WIDTH },
              ]}
            />
          )}
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps('postalCode')}
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: POSTAL_CODE_INPUT_WIDTH },
              ]}
            />
          )}
        </ScrollView>
      </View>
    )
  }
}
