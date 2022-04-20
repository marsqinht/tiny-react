
export function appendChild(container: Element | Text, el: Element | Text) {
  return container?.appendChild(el)
}

export function isInnerProperty(prop: string) {
  return prop !== 'children' && prop !== 'nodeValue'
}

export function setDomAtrribute(el: Element, props: Record<string, any>, prop: string) {
  if(prop === 'class') {
    el.className = props[prop]
  } else {
    el[prop] = props[prop]
  }
}

export function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })

  return dom
}
// export function createDom(fiber) {
//   console.log('fiber :>> ', fiber);
//   return document.createElement('div')
// }