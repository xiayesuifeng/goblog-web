import React, { Component } from 'react'
import '../tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import Viewer from 'tui-editor/dist/tui-editor-Viewer'

class TuiEditorViewer extends Component {
    constructor (props, context) {
        super(props, context)
        this.viewerRef = React.createRef()
    }

    componentDidMount () {
        let viewer = new Viewer({
            el: this.viewerRef.current,
            height: '100%'
        })
        this.setState({viewer})
    }

    componentWillReceiveProps (nextProps, nextContext) {
        this.state.viewer.setValue(nextProps.value)
    }

    render() {
        return (
            <div ref={this.viewerRef}/>
        )
    }
}

export default TuiEditorViewer