import * as React from 'react';
import {Panel} from './panel'
import {useContext} from 'react';
import {EditorContext} from '../contexto';
import Tree from 'react-animated-tree';
import {useEdicion} from '../edicion';



const treeStyles = {
  // position: 'absolute',
  top: 40,
  left: 40,
  width: '100%'
}

const typeStyles = {
  fontSize: '2em',
  verticalAlign: 'middle'
}





const Trees = (props: React.ComponentProps<typeof Tree> & {children?: React.ReactNode, style?: any}) => {
  return (<Tree {...props}>{props.children}</Tree>)
}

const SubTree = ({elems} : any) => {
  const {accion} = useEdicion();

  return (<>
    {elems.map(e => {
      if(e.children){
        return (<Trees key={e.ruta} content={e.nombre}>
          <SubTree elems={e.children}/>
         </Trees>)
      }else{
        const onTextoClick = () => {
          accion('cargar', e.ruta);
        }
        return (<Trees key={e.ruta} content={e.text} type='texto' onClick={onTextoClick} />)
      }})
    }
    </>)
}

export const PanelArbol = () => {
  const {textos} = useContext(EditorContext);

  return ( <Panel id="arbol">
    <Trees content="Escritos" open style={treeStyles}>
      <SubTree elems={textos}/>
    </Trees>
  </Panel> )
}

// <Trees content="hello" type={<span style={typeStyles}>🙀</span>} canHide />
// <Trees content="subtree with children" canHide>
//   <Trees content="hello" />
//   <Trees content="sub-subtree with children">
//     <Trees content="child 1" style={{ color: '#63b1de' }} />
//     <Trees content="child 2" style={{ color: '#63b1de' }} />
//     <Trees content="child 3" style={{ color: '#63b1de' }} />
//   </Trees>
//   <Trees content="hello" />
// </Trees>
// <Trees content="hello" canHide />
// <Trees content="hello" canHide />
