import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import Vex from "vexflow";

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
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const loadQuestions = async () => {
        const data = await client.getData('/notations');
        let notations = data._embedded.notations;
        setQuestions(notations.map(n =>
            <div key={n._links.self.href}>
                <Question notation={n}/>
            </div>
        ));
    };

    let content = (questions.length > 0)
        ? <div>{questions[currentQuestion]}</div>
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

function Question(props) {

    let width = 200;
    let height = 150;

    let self = props.notation._links.self.href;
    let id = 'music_canvas_' + self.substring(self.lastIndexOf('\/') + 1);

    useEffect(() => {
        let vexflow = new Vex.Flow.Factory({
            renderer: {
                elementId: id,
                backend: Vex.Flow.Renderer.Backends.SVG,
                width: width,
                height: height
            },
        });
        let score = vexflow.EasyScore();
        let system = vexflow.System();

        let notes = props.notation.description + '4/w';
        system.addStave({
            voices: [score.voice(score.notes(notes))]
        }).addClef('treble');
        vexflow.draw();
    });

    return (
        <div id={id}
             style={{
                 backgroundColor: 'linen',
                 borderRadius: '15px',
                 width: width+'px',
                 height: height+'px'
             }}
        />
    );

}


ReactDOM.render(<App/>, document.getElementById('react'));
