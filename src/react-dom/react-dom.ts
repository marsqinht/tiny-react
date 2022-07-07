
/**
 *
 * TODO:
 * 1.ReactNode定义
 * 2.
 */
export interface ReactNode {
  type: string,
  props: {
    children: ReactNode[]
    nodeValue?: string | number | boolean | null
    [key: string]: unknown
  }
}

const TEXT_ELEMENT_TYPE = 'TEXT_ELEMENT'

// interface Fiber {
//   type?: string
//   props: {
//     children: ReactNode[]
//     [key: string]: any
//   }
//   alternate?: Fiber | null
//   return?: Fiber
//   child?: Fiber
//   sibling?: Fiber
//   dom: Element | Text
// }

export function createElement (type: string, props?: Record<string, unknown> | null, ...children: any[]): ReactNode {
  return {
    type,
    props: {
      ...props,
      children: children?.filter(v => v)?.map(child => {
        return typeof child === 'object' ? child : createTextElement(child)
      }) || []
    }
  }
}

function createTextElement (node: string) {
  return {
    type: TEXT_ELEMENT_TYPE,
    props: {
      nodeValue: node,
      children: []
    }
  }
}
