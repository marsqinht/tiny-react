import { appendChild, isInnerProperty, setDomAtrribute } from "./dom"

interface ReactNode {
  type: string,
  props: {
    children: ReactNode[]
    nodeValue?: string | number | boolean | null
    [key: string]: unknown
  }
}

const TEXT_ELEMENT_TYPE = 'TEXT_ELEMENT'

export function createElement(type: string, props?: Record<string, unknown> | null, ...children: any[]): ReactNode {
  return {
    type,
    props: {
      ...props,
      children: children?.filter(v => v)?.map(child =>  {
        return typeof child === 'object' ?  child : createTextElement(child)
      }) || []
    }
  }
}

export function render(element: ReactNode, container: Element | string) {
  const root = typeof container === 'string' ? document.querySelector(container): container

  if(!root) {
    throw new Error('root节点不存在')
  }
  return innerRender(element, root)
}

function innerRender(reactNode: ReactNode, container: Element | Text) {
  const { type, props } = reactNode
  const el = type === TEXT_ELEMENT_TYPE ? document.createTextNode(`${props.nodeValue}`) : document.createElement(type)
  Object.keys(props).forEach(prop => {
    if(isInnerProperty(prop)) {
      setDomAtrribute(el as Element, props, prop)
    }
  })
  props.children.forEach(child => {
    innerRender(child, el)
  })
  appendChild(container, el)
}



function createTextElement(node: string) {
  return {
    type: TEXT_ELEMENT_TYPE,
    props: {
      nodeValue: node,
      children: []
    }
  }
}