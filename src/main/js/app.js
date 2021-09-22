import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

import client from './api/client';
import NoteCard from './note-card';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notation: {},
            notations: [],
            users: [],
            pageSize: 2,
            pageNum: 0,
            links: {},
            showNoteCard: false
        };
        this.onNavigate = this.onNavigate.bind(this);
        this.onNotationClick = this.onNotationClick.bind(this);
    }

    componentDidMount() {
        this.onNavigate().then(() => {});
    }

    async onNavigate(href) {
        try {
            let results = /page=(\d+)/g.exec(href);
            let pageNum = (results) ? results[1] : 0;

            const notations_data = await client.getData('/notations');
            let notations = notations_data._embedded.notations;

            const user_data = await client.getData('/users', pageNum, this.state.pageSize);
            let users = user_data._embedded.users;
            let links = user_data._links;

            this.setState({
                notations: notations,
                users: users,
                links: links,
                pageNum: pageNum
            });
        } catch (err) {
            console.error(err);
        }
    }

    onNotationClick(event, target) {
        event.preventDefault();
        this.setState({
            notation: target
        });
    }

    render() {
        let notations = this.state.notations.map(notation =>
            <li>
                <Button href='#'
                        key={notation._links.self.href}
                        onClick={() => {
                            this.setState({
                                notation: notation,
                                showNoteCard: true
                            });
                        }}
                >
                    {notation.description}
                </Button>
                {
                    (this.state.notation === notation) &&
                    <NoteCard key={'notecard_'+notation._links.self.href}
                              notation={this.state.notation}
                    />
                }
            </li>
        );
        return (
            <Container className='p-3'>
                <Jumbotron>
                    {/*<h1>Users</h1>*/}
                    {/*<UserList users={this.state.users}*/}
                    {/*          links={this.state.links}*/}
                    {/*          pageSize={this.state.pageSize}*/}
                    {/*          onNavigate={this.onNavigate}*/}
                    {/*/>*/}
                    <ul>{notations}</ul>
                </Jumbotron>
            </Container>
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
