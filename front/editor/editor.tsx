import * as React from 'react';
import {Controles} from './controles';
import {Paneles} from './paneles/index';
import {EditorContextProvider} from './contexto';

export const Editor = () => {
  return (
    <EditorContextProvider>
      <div id="editor">
        <Controles/>
        <Paneles/>
      </div>
    </EditorContextProvider>
  )
}
