import React from 'react';
// import ReactDOM from 'react-dom';

class Clock extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    componentDidMount () {
        this.timerID = setInterval(() => {
            this.tick();
        }, 1000);
    }

    componentWillUnmount () {
        clearInterval(this.timerID);
    }

    tick () {
        this.setState({
            date: new Date()
        });
    }

    render () {
        return (
            <div class="content">
                <h2>定时器</h2>
                <h2>时间：{this.state.date.toLocaleTimeString()}</h2>
            </div>
        );
    }
}

export default Clock;
