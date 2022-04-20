
interface ReactNode {
  type: string,
  props: {
    children: ReactNode[],
    nodeValue?: string | number | boolean | null,
    [key: string]: unknown
  }
}


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

export function render(element: ReactNode, container: string | Element) {
  const el = document.createElement(element.type)
  const root = typeof container === 'string' ? document.querySelector(container): container

  console.log('root :>> ', root);

  root?.appendChild(el)
}


function createTextElement(node: string) {
  return {
    type: 'text_element',
    nodeValue: node,
    children: []
  }
}