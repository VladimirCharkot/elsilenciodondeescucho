import * as React from 'react';
import {useState, useContext, CSSProperties} from 'react';
import {EditorContext} from '../contexto';
import {Panel} from './panel';
import {useEdicion} from '../edicion';
import {NodoFS} from '../../../shared/types/arbol';


interface ImagenProps{
  imagen: NodoFS,
  ancho: number
}

const Imagen = ({imagen, ancho}: ImagenProps) => {
  const {imagenSeleccionada, setImagenSeleccionada, setRutaImagenes} = useContext(EditorContext);
  const {insertarImagen} = useEdicion();
  const divStyle: CSSProperties = { position: 'relative', width: `${ancho}px`, height: `${ancho * 2/3}px` }
  const btnStyle: CSSProperties = { position: 'absolute', bottom: 0, right: 0}

  return (
      imagen.children ?

        (<div className='carpeta_vitrina' style={divStyle}>
          <img src='/icon/folder.png' className={imagen.ruta == imagenSeleccionada ? 'seleccionada' : ''} onDoubleClick={() => setRutaImagenes(imagen.nombre) }/>
          <p>{imagen.nombre}</p>
        </div>) :

        (<div className='imagen_vitrina' style={divStyle}>
          <img src={imagen.ruta}
            className={imagen.ruta == imagenSeleccionada ? 'seleccionada' : ''}
            onClick={() => setImagenSeleccionada(imagen.ruta)}
            onDoubleClick={() => insertarImagen(imagen.ruta)}/>

          {imagen.atributos && imagen.atributos.referencias && <div className="minibtn link_a_texto" title={imagen.atributos.referencias.join(' | ')} style={btnStyle} />}

          <p>{imagen.nombre}</p>
        </div>)
  )
}

export const PanelImagenes = () => {
  const {imagenesMostradas, imagenesPath, setRutaImagenes} = useContext(EditorContext);
  const [anchoImagen, setAnchoImagen] = useState(220);
  const ordenadas = [
    ...imagenesMostradas.filter(i => i.children),
    ...imagenesMostradas.filter(i => !i.children)
  ]
  // console.log(`Imagenes mostradas:`)
  // console.log(imagenesMostradas)
  return (<Panel id="imagenes">
    <div id="vitrina" style={{position: 'relative'}}>
      <input type='range' name='width' min={50} max={800} style={{position: 'absolute', top: 0, left: 0}} value={anchoImagen} onChange={(e) => {
        setAnchoImagen(Number(e.target.value));
      }}/>
      {ordenadas.map((img, i) => (<Imagen key={i} imagen={img} ancho={anchoImagen}/>))}
    </div>
    {imagenesPath.length > 0 &&
      <div id="ruta">
        <p>{'> ' + imagenesPath.join(' > ')}</p>
        <a onClick={() => { setRutaImagenes('..') }}>{'< Volver'}</a>
      </div>
    }
  </Panel>)}


  // <div className="controles">
  //   <Control id="subir_imagen" texto="Cargar imagen" accion={() => {}}/>
  //   <input id="archivo_imagen" type="file"/>
  //   <Control id="borrar_imagen" texto="Borrar imagen" accion={() => {}}/>
  // </div>


// let cursor = textarea_md.selectionStart!
// let txt = textarea_md.value
// textarea_md.value = txt.slice(0, cursor) + `\n![Texto alt](${img.src})\n` + txt.slice(cursor, txt.length)
