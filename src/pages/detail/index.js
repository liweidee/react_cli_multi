import React from 'react';
import ReactDOM from 'react-dom';

import 'src/commons/styles/base.scss';
import './index.scss';
import $ from 'jquery';

console.log($.ajax);

/* eslint-disable */
class App extends React.Component {
    render () {
        return (
            <div>Hello world</div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
