import React, {Component, useState} from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';

import client from './api/client';

function App() {

    return (
        <Container>
            <div className={'p-5 mb-4 bg-dark rounded-3'}>
                <div className={'container-fluid py-5'}>
                    <h1 className={'display-5 fw-bold'}>Note Quiz</h1>
                    <Quiz/>
                </div>
            </div>
        </Container>
    );

}

function Quiz() {

    const [questions, setQuestions] = useState([]);

    const loadQuestions = async () => {
        const data = await client.getData('/notations');
        let notations = data._embedded.notations;
        setQuestions(notations.map(n =>
            <span key={n._links.self.href}>{n.description} </span>
        ));
    };

    let content = (questions.length > 0)
        ? <div>{questions}</div>
        : <Card body className={'position-relative'} style={{ width: '18rem', height: '8rem' }}>
            <Button className={'position-absolute top-50 start-50 translate-middle'}
                    style={{ width: '17rem', height: '7rem' }}
                    onClick={loadQuestions}>
                Get Questions
            </Button>
          </Card>;

    return (
        <>{content}</>
    );

}


ReactDOM.render(<App/>, document.getElementById('react'));
