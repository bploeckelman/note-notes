import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import client from './api/client';
import NoteCard from './note-card';

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
                <NoteCard/>
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
