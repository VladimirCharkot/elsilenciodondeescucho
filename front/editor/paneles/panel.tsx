import * as React from 'react';
import {useContext} from 'react';
import {EditorContext} from '../contexto';


interface PanelProps{
  id: string,
  className?: string,
  children?: React.ReactNode,
  expandido?: boolean,
  innerHTML?: string
}

export const Panel = ({id, className, children, innerHTML}: PanelProps) => {
  const {expandidos} = useContext(EditorContext);
  if(innerHTML){
    return (
      <div className={`panel ${expandidos.includes(id) ? 'expandido' : 'contraido'} ${className ?? 'lala'}`} id={id}
      dangerouslySetInnerHTML={{__html: innerHTML}}></div>)
  }else{
    return (
      <div className={`panel ${expandidos.includes(id) ? 'expandido' : 'contraido'} ${className}`} id={id}>
      {children}
      </div>)
  }
}
