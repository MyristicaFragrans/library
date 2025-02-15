import { render } from 'preact'
import { App } from './components/app'
import './index.less'

render(<App />, document.getElementById('app') as HTMLElement)
