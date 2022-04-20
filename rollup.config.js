import path from 'path'
import resolve from 'rollup-plugin-node-resolve' // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
import ts from 'rollup-plugin-typescript2'
const getPath = _path => path.resolve(__dirname, _path)
import packageJSON from './package.json'


const extensions = [
  '.js',
  '.ts',
  '.tsx'
]


// ts
const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
  extensions
})


// 基础配置
const commonConf = {
  input: getPath('./app.ts'),
  plugins:[
    resolve(extensions),
    commonjs(),
    tsPlugin,
  ],
  output: {
    file: './dist/app.js',
    format: 'umd',
  }
}


export default commonConf