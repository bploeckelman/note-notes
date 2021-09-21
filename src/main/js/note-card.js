import React, {Component} from 'react';
import Vex from "vexflow";

const width = 520;
const height = 160;

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

        let notes = 'G3/8, C4, E4';

        system.addStave({
            voices: [
                score.voice(
                    score.tuplet(score.beam(score.notes(notes)))
                        .concat(score.tuplet(score.beam(score.notes(notes))))
                        .concat(score.tuplet(score.beam(score.notes(notes))))
                        .concat(score.tuplet(score.beam(score.notes(notes))))
                )
            ]
        })
        .addClef('treble')
        .addKeySignature('E')
        ;

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
