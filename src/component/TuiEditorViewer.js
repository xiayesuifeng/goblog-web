import React, { Component } from 'react'
import '../tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import Viewer from 'tui-editor/dist/tui-editor-Viewer'

class TuiEditorViewer extends Component {

    componentDidMount () {
        let viewer = new Viewer({
            el: document.querySelector('#tui-editor-viewer'),
            height: '100%'
        })

        this.setState({viewer})
    }

    componentWillReceiveProps (nextProps, nextContext) {
        this.state.viewer.setValue(nextProps.value)
    }

    render() {
        return (
            <div id="tui-editor-viewer"/>
        )
    }
}

export default TuiEditorViewer