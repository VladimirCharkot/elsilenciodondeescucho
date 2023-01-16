import * as React from 'react';
import {Panel} from './panel'
import {useContext} from 'react';
import {EditorContext} from '../contexto';
import {useEdicion} from '../edicion';
import Tree, {TreeNode} from 'rc-tree';



const treeData = [
  {
    key: '0-0',
    title: 'parent 1',
    children: [
      { key: '0-0-0', title: 'parent 1-1', children: [{ key: '0-0-0-0', title: 'parent 1-1-0' }] },
      {
        key: '0-0-1',
        title: 'parent 1-2',
        children: [
          { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
          { key: '0-0-1-1', title: 'parent 1-2-1' },
          { key: '0-0-1-2', title: 'parent 1-2-2' },
          { key: '0-0-1-3', title: 'parent 1-2-3' },
          { key: '0-0-1-4', title: 'parent 1-2-4' },
          { key: '0-0-1-5', title: 'parent 1-2-5' },
          { key: '0-0-1-6', title: 'parent 1-2-6' },
          { key: '0-0-1-7', title: 'parent 1-2-7' },
          { key: '0-0-1-8', title: 'parent 1-2-8' },
          { key: '0-0-1-9', title: 'parent 1-2-9' },
          { key: 1128, title: 1128 },
        ],
      },
    ],
  },
];




const Trees = (props: React.ComponentProps<typeof Tree> & {children?: React.ReactNode, style?: any}) => {
  return (<Tree {...props}>{props.children}</Tree>)
}

const TreeNodes = (props: React.ComponentProps<typeof TreeNode> & {children?: React.ReactNode, style?: any}) => {
  return (<TreeNode {...props}>{props.children}</TreeNode>)
}

const SubTree = ({elems} : any) => {
  const {accion} = useEdicion();

  return (<>
    {elems.map(e => {
      if(e.children){
        return (<TreeNodes prefixCls={null} key={e.ruta}>
          <SubTree elems={e.children}/>
         </TreeNodes>)
      }else{
        const onTextoClick = () => {
          accion('cargar', e.ruta);
        }
        return (<TreeNodes prefixCls={null} key={e.ruta} />)
      }})
    }
    </>)
}

export const PanelArbol = () => {
  const {textos} = useContext(EditorContext);

  return ( <Panel id="arbol">
    <Trees prefixCls="arbolico"
          className="myCls"
          defaultExpandAll
          treeData={treeData}
          onSelect={console.log}
          height={150}>
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
