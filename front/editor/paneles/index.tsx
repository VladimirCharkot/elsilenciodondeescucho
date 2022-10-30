import * as React from 'react';

import {PanelArbol} from './arbol_jstree';
import {PanelImagenes} from './imagenes';
import {PanelMd} from './md';
import {PanelPrevia} from './previa';

export const Paneles = () => {
  return (
    <div id="paneles">
      <PanelArbol/>
      <PanelImagenes/>
      <PanelMd/>
      <PanelPrevia/>
    </div>
  )
}
