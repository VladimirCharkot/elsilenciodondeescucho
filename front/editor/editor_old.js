import {render} from '../procesos/mdesde';
// import {flash} from './general';

const area_md = document.querySelector('#md')!;
const textarea_md = (document.querySelector('#md textarea')! as HTMLInputElement);
// const panel_imagenes = (document.querySelector('#vitrina')! as HTMLDivElement);
// const input_imagenes = (document.querySelector('#archivo_imagen')! as HTMLInputElement);
// const btn_status = document.querySelector('#status')! as HTMLElement;
// const area_previa = document.querySelector('#previa')! as HTMLElement;
//
//
//
// // Botones:
// const btn_texto = document.querySelector('#texto')! as HTMLElement;
// const btn_preview = document.querySelector('#preview')! as HTMLElement;
// const btn_archivos = document.querySelector('#archivos')! as HTMLElement;
// const btn_imgs = document.querySelector('#imgs')! as HTMLElement;
// const btn_logout = document.querySelector('#logout')! as HTMLElement;
//
// btn_texto.addEventListener('click', () => {toggle('#md')});
// btn_preview.addEventListener('click', () => {toggle('#previa')});
// btn_archivos.addEventListener('click', () => {toggle('#arbol')});
// btn_imgs.addEventListener('click', () => {toggle('#imagenes')});
// btn_logout.addEventListener('click', () => {logout()})
//
//
// const btn_subir_imagen = document.querySelector('#subir_imagen')! as HTMLElement;
// const input_archivo_imagen = document.querySelector('#archivo_imagen')! as HTMLInputElement;
// const btn_borrar_imagen = document.querySelector('#borrar_imagen')! as HTMLElement;
//
// btn_subir_imagen.addEventListener('click', () => {input_archivo_imagen.click()})
// input_archivo_imagen.addEventListener('change', cargar_imagen)
// btn_borrar_imagen.addEventListener('click', borrar_imagen)
//
//
// const btn_nuevo = document.querySelector('#nuevo')! as HTMLElement;
// const btn_guardar = document.querySelector('#guardar')! as HTMLElement;
// const btn_reset = document.querySelector('#reset')! as HTMLElement;
// const input_nombre = document.querySelector('#nombre')! as HTMLInputElement;
// const btn_borrar = document.querySelector('#borrar')! as HTMLElement;
// const btn_cerrar = document.querySelector('#cerrar')! as HTMLElement;
// const texto_md = document.querySelector('#texto_md')! as HTMLElement;
//
//
// btn_nuevo.addEventListener('click', nuevo);
// btn_guardar.addEventListener('click', guardar);
// btn_reset.addEventListener('click', reset);
// input_nombre.addEventListener('keyup', editado);
// btn_borrar.addEventListener('click', borrar);
// btn_cerrar.addEventListener('click', cerrar);
// texto_md.addEventListener('keyup', () => {previa(); editado();})
//
//
// export const previa = () => {
//   let elmd = textarea_md.value
//   let parseado = render(elmd).html
//   area_previa!.innerHTML = parseado
// }
//
// setTimeout(previa, 2000)








async function updarbol(){
  let response = await fetch('/indice')
  let indice = await response.json()
  //@ts-ignore
  $('#arbol').jstree(true).settings.core.data = indice;
  //@ts-ignore
  $('#arbol').jstree(true).refresh();
}



async function guardar(){
  let es_nuevo = area_md.classList.contains('nuevo')

  if(es_nuevo){
    console.log('Crear')
    let ruta_base = '/textos/'
    let nombre_base = input_nombre.value

    if(!nombre_base){
      flash({mensaje: 'Es necesario un nombre'})
      return
    }

    if(!nombre_base.match(/[A-Za-z0-9- ]+/)){
      flash({mensaje: '¡Nombre inválido! Sólo letras, números, espacios y guiones'})
      return
    }

    //@ts-ignore
    let nombre = nombre_base.toLowerCase().replaceAll(' ','-')
    let ruta = ruta_base + nombre + '.md'

    console.log(`El nombre es ${nombre}`)
    console.log(`La ruta es ${ruta}`)

    let contenido = textarea_md.value
    let r = await upsert(ruta, contenido)

    if(r.status == 200 || r.status == 201) {
      area_md.classList.remove('nuevo')
      area_md.classList.remove('editado')
      area_md.classList.add('guardado')
    }

    console.log(r)
    flash(r)
    updarbol()

  }else{
    console.log('Guardar')

    let arbol = $.jstree.reference('#arbol')
    let nodo = area_md.getAttribute('data-selected')
    let data = arbol.get_node(nodo)
    let ruta_base = data ? data.original.ruta : '/textos/'

    console.log(`Guardando...`)
    console.log(`La ruta base es ${ruta_base}`)

    //@ts-ignore
    let nombre = input_nombre.value.toLowerCase().replaceAll(' ','-')
    let partes = ruta_base.split('/')
    partes[partes.length - 1] = nombre
    let ruta = partes.join('/')

    console.log(`El nombre es ${nombre}`)
    console.log(`La ruta es ${ruta}`)

    if(ruta_base != ruta){
      let rj = await rename(ruta_base, ruta)
    }

    let contenido = textarea_md.value
    let r = await upsert(ruta, contenido)
    if(r.status == 200 || r.status == 201) {
      area_md.classList.remove('editado')
      area_md.classList.add('guardado')
    }
    //- desmarcar()
    console.log(r)
    flash(r)
    updarbol()

  }

}

async function reset(){
  let es_nuevo = area_md.classList.contains('nuevo')
  let seleccionado = area_md.getAttribute('data-selected')

  if(es_nuevo){
    vaciar()
    area_md.classList.remove('editado')
    return
  }

  let arbol = $.jstree.reference('#arbol')
  let data = arbol.get_node(seleccionado)

  console.log(data)

  let md = await get_md(data.original.ruta)
  textarea_md.value = md
  area_md.classList.remove('editado')
  area_md.classList.add('guardado')
  previa()
}

function editado(){
  area_md.classList.remove('guardado')
  area_md.classList.add('editado')
}

function cerrar(){
  if (area_md.classList.contains('editado')){
    flash({mensaje: 'No está permitido cerrar un editor sin guardar o resetear'})
  }else{
    vaciar()
    area_md.classList.remove('editado')
    area_md.classList.remove('guardado')
    area_md.classList.remove('nuevo')
    area_md.classList.add('vacio')
  }
}

async function borrar(){
  if(confirm("¿Borrar posta?")){
    let arbol = $.jstree.reference('#arbol')
    let nodo = area_md.getAttribute('data-selected')
    let data = arbol.get_node(nodo)
    let ruta = data.original.ruta
    let r = await erase(ruta)
    flash(r)
    updarbol()
    vaciar()
  }
}

function vaciar(){
  textarea_md.value = ''
  input_nombre.value = ''
}




/* Cargar árbol de textos */
window.addEventListener('load', () =>
  fetch('/indice')
    .then(r => r.json())
    .then(indice => {

      console.log('Recibido indice:')
      console.log(indice)

    $('#arbol').jstree({
      "types" : {
        "default" : {
          //- "icon" : "/icon/articulo.png"
          "icon" : "texto-icono"
        },
        "carpeta" : {
          "icon" : "carpeta-icono"
        }
      },
      "plugins" : [ "types", "dnd", "search" ],
      "core" : {
        "data" : indice,
        "multiple" : false,
        "check_callback" : function (operation: any, node: any, node_parent: any, node_position: any, more: any) {
          console.log(operation)
          console.log(node)
          console.log(node_parent)
          console.log(node_position)
          console.log(more)
          return operation == 'move_node' && node_parent.original.es_carpeta
        }
      }
    })


    $('#arbol').on("select_node.jstree", (e, data) => {
      console.log("select_node.jstree")
      console.log(data)
      console.log(data.selected[0])
      let editado = area_md.classList.contains('editado')
      let seleccionado = area_md.getAttribute('data-selected')

      if(editado){
        flash({mensaje: 'Guardar o descartar cambios antes'})
        document.querySelectorAll('#md .btn').forEach(e => e.classList.add('call_eye'))
        let arbol = $.jstree.reference('#arbol')
        arbol.deselect_all()
        //- let nodo = arbol.select_node(seleccionado)
        return
      }

      if(!data.node.original.es_carpeta){
        load_md(data.node.original.ruta)
        area_md.setAttribute('data-selected', data.node.id)
        input_nombre.value = data.node.text
      }else{
        $.jstree.reference('#arbol')
          .toggle_node(data.node);
      }
    })

    document.querySelectorAll('#md .btn').forEach(e => {
      e.addEventListener('animationend', (ev) => {
        e.classList.remove('call_eye');
      })
    })



    $('#arbol').on("create_node.jstree", (e, data) => {
      console.log("create_node.jstree")
      console.log(data)
    })

    $('#arbol').on("rename_node.jstree", (e, data) => {
      console.log("rename_node.jstree")
      console.log(data)
    })

    $('#arbol').on("delete_node.jstree", (e, data) => {
      console.log("delete_node.jstree")
      console.log(data)
    })

    /* Drag and drop move */
    $('#arbol').on("move_node.jstree", (e, data) => {
      console.log("move_node.jstree")
      console.log(data)

      let origen = data.node.original.ruta

      let destino = ''
      let p = data.node
      while(p.id != '#'){
        destino = '/' + $.jstree.reference('#arbol').get_node(p.id).text + destino
        p = $.jstree.reference('#arbol').get_node(p.parent)
      }
      destino = '/textos' + destino

      let r = rename(origen, destino).then(r => {
        if (r.status == 200){
          data.node.original.ruta = destino
        }
        flash(r)
      })
    })

    $('#arbol').on("copy_node.jstree", (e, data) => {
      console.log("copy_node.jstree")
      console.log(data)
    })

  }
))



let corregir_imagenes = () => {
  document.querySelectorAll('p img').forEach(i => i.parentElement!.replaceWith(i))
}


/* Vaciar editor */
window.addEventListener('load', () => {

  /* Scroll sync */
  $('#md textarea').on('scroll', function () {
    $('#previa').scrollTop($(this).scrollTop() ?? 0);
  })

  $('#previa').on('scroll', function () {
    $('#md textarea').scrollTop($(this).scrollTop() ?? 0);
  })

  vaciar()
  previa()

  corregir_imagenes();

})


/* Cargar imágenes */

btn_imgs.addEventListener('click', cargar_imagenes)
btn_imgs.addEventListener('click', () =>
  btn_imgs.removeEventListener('click', cargar_imagenes)
)




function toggle(s: string){
  $(s).toggleClass('expandido')
}


function leer_tecla(e: {key: string}){

  if (e.key == 'Escape'){
    area_previa.focus()
    return
  }

  // Si estoy en el textarea no quiero capturar el teclado:
  const active = document.activeElement
  const on_textarea = (active && active.tagName.toLowerCase() == 'textarea')
  const on_input = (active && active.tagName.toLowerCase() == 'input')
  if (on_textarea) return
  if (on_input) return

  if (e.key == ' ') toggle('#md')
  if (e.key == 'a'  || e.key == 'A') toggle('#arbol')
  if (e.key == 'i'  || e.key == 'I') toggle('#imagenes')
  if (e.key == 'p'  || e.key == 'P') toggle('#previa')
  if (e.key == 'e'  || e.key == 'E') toggle('#md')

}

window.onkeyup = leer_tecla;

function logout(){
  window.location.href = '/logout';
}
