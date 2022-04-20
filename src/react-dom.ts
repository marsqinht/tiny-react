// import { appendChild, isInnerProperty, setDomAtrribute } from "./dom"

import { createDom } from "./dom"

interface ReactNode {
  type: string,
  props: {
    children: ReactNode[]
    nodeValue?: string | number | boolean | null
    [key: string]: unknown
  }
}

const TEXT_ELEMENT_TYPE = 'TEXT_ELEMENT'


interface Fiber {
  type?: string
  props: {
    children: ReactNode[]
    [key: string]: any
  }
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
  dom: Element | Text | null
}

let nextUnitOfWork: Fiber | undefined
let wipRoot: Fiber | null = null

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


// function innerRender(reactNode: ReactNode, container: Element | Text) {
//   const { type, props } = reactNode
//   const el = type === TEXT_ELEMENT_TYPE ? document.createTextNode(`${props.nodeValue}`) : document.createElement(type)
//   Object.keys(props).forEach(prop => {
//     if(isInnerProperty(prop)) {
//       setDomAtrribute(el as Element, props, prop)
//     }
//   })
//   props.children.forEach(child => {
//     innerRender(child, el)
//   })
//   appendChild(container, el)
// }
function commitRoot() {
  commitWork(wipRoot?.child)
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function innerRender(reactNode: ReactNode, container: Element | Text) {

  wipRoot = {
    dom: container,
    props: {
      children: [ reactNode ],
    }
  }
  nextUnitOfWork = wipRoot
  

  function performUnitOfWork(fiber: Fiber) {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber)
    }
  
    // if (fiber.parent && fiber.parent.dom && fiber.dom) {
    //   fiber.parent.dom.appendChild(fiber.dom)
    // }
  
    const elements = fiber.props.children
    let index = 0
    let prevSibling: Fiber | null = null
  
    while (index < elements.length) {
      const element = elements[index]
  
      const newFiber: Fiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: null,
      }
  
      if (index === 0) {
        fiber.child = newFiber
      } else {
        prevSibling &&  (prevSibling.sibling = newFiber)
      }
  
      prevSibling = newFiber
      index++
    }
  
    if (fiber.child) {
      return fiber.child
    }
    
    let nextFiber = fiber
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling
      }
      nextFiber = nextFiber.parent as Fiber
    }
  }

  function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(
        nextUnitOfWork as Fiber
      )
  
      shouldYield = deadline.timeRemaining() < 1
    }

    
    if (!nextUnitOfWork && wipRoot) {
      commitRoot()
    }
  
    requestIdleCallback(workLoop)
  } 

  requestIdleCallback(workLoop)

  
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