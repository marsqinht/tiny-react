import { describe, it, expect } from 'vitest'
import { createElement } from '../react-dom'
describe('react-dom', () => {
  it('create div element with id', () => {
    const fiberNode = createElement('div', { id: 'foo' })

    expect(fiberNode).toEqual({
      props: {
        children: [],
        id: 'foo'
      },
      type: 'div'
    })
  })

  it('create span element with id', () => {
    const fiberNode = createElement('span', { id: 'foo' })

    expect(fiberNode).toEqual({
      props: {
        children: [],
        id: 'foo'
      },
      type: 'span'
    })
  })

  it('create div element with class', () => {
    const fiberNode = createElement('div', { class: 'foo' }
    )

    expect(fiberNode).toEqual({
      props: {
        children: [],
        class: 'foo'
      },
      type: 'div'
    })
  })

  it('create div element with child', () => {
    const fiberNode = createElement(
      'div',
      { class: 'foo' },
      createElement('span', null)
    )

    expect(fiberNode).toEqual({
      props: {
        children: [{ props: { children: [] }, type: 'span' }],
        class: 'foo'
      },
      type: 'div'
    })
  })

  it('create div element with text child', () => {
    const fiberNode = createElement(
      'div',
      { class: 'foo' },
      'text'
    )

    expect(fiberNode).toEqual({
      props: {
        children: [{ props: { nodeValue: 'text', children: [] }, type: 'TEXT_ELEMENT' }],
        class: 'foo'
      },
      type: 'div'
    })
  })

  it('create div element with children', () => {
    const fiberNode = createElement(
      'div',
      { class: 'foo' },
      createElement('div', null),
      createElement('div', { id: 'childId' })
    )

    expect(fiberNode).toEqual({
      props: {
        children: [
          {
            props: {
              children: []
            },
            type: 'div'
          },
          {
            props: {
              children: [],
              id: 'childId'
            },
            type: 'div'
          }
        ],
        class: 'foo'
      },
      type: 'div'
    })
  })
})
