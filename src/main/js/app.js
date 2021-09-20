import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Vex from 'vexflow';

import client from './api/client';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            pageSize: 2,
            pageNum: 0,
            links: {}
        };
        this.onNavigate = this.onNavigate.bind(this);
    }

    componentDidMount() {
        this.onNavigate().then(() => {});
        this.vexflow = new Vex.Flow.Factory({
            renderer: {
                elementId: 'music_canvas',
                backend: Vex.Flow.Renderer.Backends.SVG,
                width: 450,
                height: 250
            },
        });
        this.score = this.vexflow.EasyScore();
        this.system = this.vexflow.System();

        this.setupStaves();
        this.redraw();
    }

    setupStaves() {
        let system = this.system;
        let score = this.score;

        system
            .addStave({
                voices: [
                    score.voice(score.notes('C#5/q, B4, A4, G#4', {stem: 'up'})),
                    score.voice(score.notes('C#4/h, C#4', {stem: 'down'}))
                ]
            })
            .addClef('treble')
            .addTimeSignature('4/4');

        system
            .addStave({
                voices: [
                    score.voice(score.notes('A4/q, B4, C5, D5', {stem: 'up'}))
                ]
            })
            .addClef('bass')
            .addTimeSignature('4/4');

        system.addConnector();
    }

    redraw() {
        this.vexflow.draw();
    }

    async onNavigate(href) {
        try {
            let results = /page=(\d+)/g.exec(href);
            let pageNum = (results) ? results[1] : 0;
            const data = await client.getData('/users', pageNum, this.state.pageSize);
            this.setState({
                users: data._embedded.users,
                links: data._links,
                pageNum: pageNum
            });
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        return (
            <div>
                <h1>Users</h1>
                <UserList users={this.state.users}
                          links={this.state.links}
                          pageSize={this.state.pageSize}
                          onNavigate={this.onNavigate}
                />
                <div id='music_canvas'
                     style={{
                         backgroundColor: 'linen',
                         borderRadius: '15px',
                         width: '500px',
                         height: '250px'
                     }}
                />
            </div>
        )
    }

}

const Nav = { first: 'first', prev: 'prev', next: 'next', last: 'last' };

class UserList extends Component {

    constructor(props) {
        super(props);
        this.handleNav = this.handleNav.bind(this);
    }

    handleNav(event, nav) {
        event.preventDefault();
        switch (nav) {
            case Nav.first: this.props.onNavigate(this.props.links.first.href); break;
            case Nav.prev:  this.props.onNavigate(this.props.links.prev.href); break;
            case Nav.next:  this.props.onNavigate(this.props.links.next.href); break;
            case Nav.last:  this.props.onNavigate(this.props.links.last.href); break;
        }
    }

    render() {
        const users = this.props.users.map(user =>
            <User key={user._links.self.href} user={user}/>
        );

        const navLinks = [];
        if (Nav.first in this.props.links) navLinks.push(<button key={Nav.first} onClick={(event) => this.handleNav(event, Nav.first)}>&lt;&lt;</button>);
        if (Nav.prev  in this.props.links) navLinks.push(<button key={Nav.prev} onClick={(event) => this.handleNav(event, Nav.prev)}>&lt;</button>);
        if (Nav.next  in this.props.links) navLinks.push(<button key={Nav.next} onClick={(event) => this.handleNav(event, Nav.next)}>&gt;</button>);
        if (Nav.last  in this.props.links) navLinks.push(<button key={Nav.last} onClick={(event) => this.handleNav(event, Nav.last)}>&gt;&gt;</button>);

        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th>Name</th>
                    </tr>
                    {users}
                    </tbody>
                </table>
                <p>
                    {navLinks}
                </p>
            </div>
        );
    }
}

function User(props) {
    return (
        <tr>
            <td>{props.user.name}</td>
        </tr>
    );
}


ReactDOM.render(<App/>, document.getElementById('react'));
