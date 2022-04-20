





export function createElement(type: string, props?: Record<string, unknown> | null, ...children: any[]) {
  return {
    type,
    props: {
      ...props,
      children
    }
  }
}