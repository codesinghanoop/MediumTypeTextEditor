

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import SelectionPopover from 'react-selection-popover'
import Highlightable, { Range } from 'highlightable'
import mediumDraftExporter from 'medium-draft/lib/exporter';
import { convertFromHTML } from 'draft-convert';
import mediumDraftImporter from 'medium-draft/lib/importer';
import {
  Editor,
  createEditorState,
  Link, findLinkEntities
} from 'medium-draft';
import {
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  EditorState
} from 'draft-js';

var windowLocalStorage = window.localStorage;
const data = "This is the first selectable paragraph. Looking pretty good.Lorem ipsum dolor sit amet, consectetur adipisicing. "

class EditorComponent extends React.Component {
	constructor() {
    	super();
        let editorState;
		console.log('the saved data is',JSON.parse(windowLocalStorage.getItem('savedHighlightedContent')))
    	const rawState = JSON.parse(windowLocalStorage.getItem('savedHighlightedContent'))? JSON.parse(windowLocalStorage.getItem('savedHighlightedContent')) : convertToRaw(convertFromHTML("Language designers want to design the perfect language. They want to be able to say, “My language is perfect. It can do everything.” But it’s just plain impossible to design a perfect language, because there are two ways to look at a language. One way is by looking at what can be done with that language. The other is by looking at how we feel using that language – how we feel while programming. -Yukihiro “Matz” Matsumoto, creator of Ruby"));
		console.log('the raw data is',rawState)
		editorState = createEditorState(rawState)
		
        this.state = {
        	showPopover: false,
			start: -1,
			end: -1,
			data: "This is the first selectable paragraph. Looking pretty good.Lorem ipsum dolor sit amet, consectetur adipisicing. ",
			showMarker: false,
			editorState
        };
		
		this.onChange = (editorState) => {
		if(editorState.getCurrentContent() != this.state.editorState.getCurrentContent())
		{
		  windowLocalStorage.setItem('savedHighlightedContent',JSON.stringify(convertToRaw(editorState.getCurrentContent())))
		  console.log('the data to be stored is', convertToRaw(editorState.getCurrentContent()))
		}
      this.setState({ editorState });
    };
    }
	
	componentDidMount() {
    this.refs.editor.focus();
	
  }
  
  getHtml() {
    return mediumDraftExporter(this.state.editorState.getCurrentContent());
  }
	render() {
    const { editorState } = this.state;
	var inlineButtons = [  {
      label: 'highlightable',
      style: 'HIGHLIGHT',
      icon: 'highlight',
      description: 'Highlight',
    }, {
      label: 'comment',
      style: 'hyperlink',
      icon: 'link',
      description: 'Add a comment',
    }];
    return (
      <Editor
        ref="editor"
		blockButtons={[]}
		sideButtons={[]}
        editorState={editorState}
        onChange={this.onChange}
        inlineButtons={inlineButtons}		
		/>
    );
  }
};




document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <EditorComponent />,
    document.body.appendChild(document.createElement('div')),
  )
})
