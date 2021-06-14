import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Image,
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import CCInput from './CCInput'
import { InjectedProps } from './connectToState'
import Icons from './Icons'

const INFINITE_WIDTH = 1000

const s = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 60,
    height: 40,
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: 'hidden',
  },
  rightPart: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  last4: {
    flex: 1,
    justifyContent: 'center',
  },
  numberInput: {
    width: INFINITE_WIDTH,
  },
  expiryInput: {
    width: 80,
  },
  cvcInput: {
    width: 80,
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  input: {
    height: 40,
    color: 'black',
  },
})

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component<any> {
  static propTypes = {
    ...InjectedProps,
    placeholders: PropTypes.object,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,
  }

  static defaultProps = {
    placeholders: {
      number: '1234 5678 1234 5678',
      expiry: 'MM/YY',
      cvc: 'CVC',
    },
    validColor: '',
    invalidColor: 'red',
    placeholderColor: 'gray',
    additionalInputsProps: {},
  }

  componentDidMount = () => this._focus(this.props.focused)

  componentDidUpdate(prevProps: any) {
    if (prevProps.focused !== this.props.focused)
      this._focus(this.props.focused)
  }

  _focusNumber = () => this._focus('number')
  _focusExpiry = () => this._focus('expiry')

  _focus = (field: any) => {
    if (!field) return
    const refs: any = this.refs
    refs[field].focus()
    LayoutAnimation.easeInEaseOut()
  }

  _inputProps = (field: any) => {
    const {
      inputStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props

    return {
      inputStyle: [s.input, inputStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    }
  }

  _iconToShow = () => {
    const {
      focused,
      values: { type },
    } = this.props
    if (focused === 'cvc' && type === 'american-express') return 'cvc_amex'
    if (focused === 'cvc') return 'cvc'
    if (type) return type
    return 'placeholder'
  }

  render() {
    const {
      focused,
      values: { number },
      inputStyle,
      status: { number: numberStatus },
    } = this.props

    const showRightPart = focused && focused !== 'number'
    const myIcons: any = Icons
    return (
      <View style={s.container}>
        <View style={[s.leftPart, showRightPart ? s.hidden : s.expanded]}>
          <CCInput
            {...this._inputProps('number')}
            keyboardType='numeric'
            containerStyle={s.numberInput}
          />
        </View>
        <TouchableOpacity
          onPress={showRightPart ? this._focusNumber : this._focusExpiry}
        >
          <Image style={s.icon} source={myIcons[this._iconToShow()]} />
        </TouchableOpacity>
        <View style={[s.rightPart, showRightPart ? s.expanded : s.hidden]}>
          <TouchableOpacity onPress={this._focusNumber} style={s.last4}>
            <View pointerEvents={'none'}>
              <CCInput
                field='last4'
                keyboardType='numeric'
                value={
                  numberStatus === 'valid'
                    ? number.substr(number.length - 4, 4)
                    : ''
                }
                inputStyle={[s.input, inputStyle]}
                containerStyle={[s.last4Input]}
              />
            </View>
          </TouchableOpacity>
          <CCInput
            {...this._inputProps('expiry')}
            keyboardType='numeric'
            containerStyle={s.expiryInput}
          />
          <CCInput
            {...this._inputProps('cvc')}
            keyboardType='numeric'
            containerStyle={s.cvcInput}
          />
        </View>
      </View>
    )
  }
}
