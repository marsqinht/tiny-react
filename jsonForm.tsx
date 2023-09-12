import type { FormItemProps, FormProps, Rule } from 'antd/es/form'
import { Form } from 'antd'
import type { NamePath } from 'antd/es/form/interface'
import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle } from 'react'
import { useViewport } from 'reactflow'
import { NodeFormItem } from '..'
import { NodeContext } from '../../context'
import { transformAntdFormValidate } from '../../util'
import type { BaseConfig } from './register'
import { RegisteredComponents } from './register'

export type JsonFormConfig = BaseConfig & {
  label?: string
  required?: boolean
  hidden?: boolean
  name?: NamePath
  rules?: Rule[]
  className?: string
  tooltip?: FormItemProps['tooltip']
  valuePropName?: string

}
export interface JsonFormProps {
  form?: FormProps['form']
  // initialValues?: FormProps['initialValues']
  // onValuesChange?: FormProps['onValuesChange']
  registerValidate?: boolean
  validateTrigger?: Array<'onChange'>
  requiredMark?: FormProps['requiredMark']
  className?: string
  list: JsonFormConfig[]
}

export const JsonForm = forwardRef((props: JsonFormProps, ref) => {
  const { list, className = '', requiredMark = false, registerValidate = true, validateTrigger = ['onChange'] } = props
  const { data, onSaveChange, focused, registerValidateFunction, validateNode } = useContext(NodeContext)
  const [form] = Form.useForm()
  const viewport = useViewport()

  const _onValuesChange = useCallback((_values: any, s: any) => {
    onSaveChange?.(s)
    validateTrigger.includes('onChange') && validateNode?.()
  }, [validateTrigger, onSaveChange, validateNode])

  // 注册校验函数
  useEffect(() => {
    registerValidate && registerValidateFunction?.(transformAntdFormValidate(form.validateFields))
  }, [registerValidateFunction, form.validateFields, registerValidate])

  // 变量依赖变化重置表单
  useEffect(() => {
    !focused && form.setFieldsValue(data)
  }, [data, focused])

  useImperativeHandle(ref, () => form, [form])

  return <Form
    initialValues={data}
    form={form}
    requiredMark={requiredMark}
    onValuesChange={_onValuesChange}
    layout="vertical"
    className={className}
    >
    {
      list.map((item, index) => {
        const { componentProps, render, type: _type, ...rest } = item as JsonFormConfig & { render?: any; type: any }
        // @ts-expect-error ts(2339)
        const { component: Component, defaultProps = {} } = RegisteredComponents?.[item.type] || {}

        const itemProps = { ...defaultProps, ...componentProps }

        const clsName = defaultProps.className ? `${defaultProps.className} ${itemProps.className}` : itemProps.className

        const getFormItemProps = (type: string) => {
          const { label, ...restProps } = rest
          const props: Record<string, any> = restProps

          if (type !== 'Switch') {
            props.label = label
          }
          return props
        }
        if (!Component && !render) {
          return null
        }

        const genItemProps = (type: string) => {
          const _itemProps = itemProps
          if (type === 'Switch') {
            _itemProps.valuePropName = 'checked'
            _itemProps.label = rest.label
            _itemProps.tooltip = rest.tooltip
          }
          return _itemProps
        }

        return <NodeFormItem key={index} {...getFormItemProps(_type)} >
          { render ? render?.() : <Component {...genItemProps(_type) as any} className={clsName} viewport={viewport} /> }
        </NodeFormItem>
      })
    }
  </Form>
})
