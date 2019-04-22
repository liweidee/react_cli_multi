import React from 'react';
import ReactDOM from 'react-dom';

import 'src/commons/styles/base.scss';
import './index.scss';
import $ from 'jquery';
import Clock from './components/clock';

console.log($.ajax);

class App extends React.Component {
    render () {
        return (
            <div>
                <Clock />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
