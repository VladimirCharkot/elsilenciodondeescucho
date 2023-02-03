import * as React from 'react'
import { useEffect } from 'react'
import { get } from '../utils/http'
import { useNavigate } from 'react-router-dom'
import { Controles } from './controles'
import { Paneles } from './paneles/index'
import { EditorContextProvider } from './contexto'

export const Editor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    get<{ ok: boolean }>('/check').then(r => { if (!r.ok) navigate('/hogar') })
  }, [])

  return (
    <EditorContextProvider>
      <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js' />
      <script src='https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.14/jstree.min.js' />
      <div id="editor">
        <Controles />
        <Paneles />
      </div>
    </EditorContextProvider>
  )
}
