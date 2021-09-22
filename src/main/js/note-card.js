import React, {Component} from 'react';
import Vex from "vexflow";

const width = 200;
const height = 150;

export default class NoteCard extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let vexflow = new Vex.Flow.Factory({
            renderer: {
                elementId: 'music_canvas',
                backend: Vex.Flow.Renderer.Backends.SVG,
                width: width,
                height: height
            },
        });
        let score = vexflow.EasyScore();
        let system = vexflow.System();

        let notes = this.props.notation.description + '4/w';
        system.addStave({
            voices: [score.voice(score.notes(notes))]
        }).addClef('treble');
        vexflow.draw();
    }

    render() {
        return (
            <div id='music_canvas'
                 style={{
                     backgroundColor: 'linen',
                     borderRadius: '15px',
                     width: width+'px',
                     height: height+'px'
                 }}
            />
        )
    }

}
