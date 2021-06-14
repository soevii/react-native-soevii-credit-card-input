import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native'

const s = StyleSheet.create({
  baseInputStyle: {
    color: 'black',
  },
})

export default class CCInput extends Component<any> {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(['valid', 'invalid', 'incomplete']),

    containerStyle: ViewPropTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
  }

  static defaultProps = {
    label: '',
    value: '',
    status: 'incomplete',
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
    additionalInputProps: {},
  }

  componentDidUpdate(prevProps: any) {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = prevProps
    const { status: newStatus, value: newValue } = this.props

    if (value !== '' && newValue === '') onBecomeEmpty(field)
    if (status !== 'valid' && newStatus === 'valid') onBecomeValid(field)
  }

  focus() {
    const refs: any = this.refs
    refs.input.focus()
  }

  _onFocus = () => this.props.onFocus(this.props.field)
  _onChange = (value: any) => this.props.onChange(this.props.field, value)

  render() {
    const {
      label,
      value,
      placeholder,
      status,
      keyboardType,
      containerStyle,
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      additionalInputProps,
    } = this.props
    return (
      <TouchableOpacity onPress={this.focus} activeOpacity={0.99}>
        <View style={[containerStyle]}>
          {!!label && <Text style={[labelStyle]}>{label}</Text>}
          <TextInput
            ref='input'
            {...additionalInputProps}
            keyboardType={keyboardType}
            autoCapitalise='words'
            autoCorrect={false}
            style={[
              s.baseInputStyle,
              inputStyle,
              validColor && status === 'valid'
                ? { color: validColor }
                : invalidColor && status === 'invalid'
                ? { color: invalidColor }
                : {},
            ]}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            value={value}
            onFocus={this._onFocus}
            onChangeText={this._onChange}
          />
        </View>
      </TouchableOpacity>
    )
  }
}
