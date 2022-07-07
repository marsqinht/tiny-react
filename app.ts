import React from './src'

// React.createElement(
//   'div',
//   { id: 'foo' },
//   React.createElement('a', null, 'bar'),
//   React.createElement('b', null, React.createElement('h1', null, 'title'))
// )

const element = React.createElement('a', null, 'bar')

console.log('element :>> ', JSON.stringify(element, null, 2))
