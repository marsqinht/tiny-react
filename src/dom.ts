
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