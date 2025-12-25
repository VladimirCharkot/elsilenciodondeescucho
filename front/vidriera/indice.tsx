import EventEmitter from 'events';
import { debounce } from 'lodash';
import * as React from 'react';
import { Menu, NodoVidriera } from './tipos';

interface IndiceProps {
  menu: Menu;
  trigger: EventEmitter;
}

export default function Indice({ menu, trigger }: IndiceProps) {
  const [entradas, setEntradas] = React.useState<NodoVidriera[]>([]);

  // Cargar el menú al montar
  React.useEffect(() => {
    menu().then(setEntradas);
  }, [menu])

  // Función debounced para enfocar nodos, demora 300ms
  const debouncedEnfocar = React.useMemo(
    () => debounce((slug: string) => {
      trigger.emit('enfocar', slug);
    }, 300), // 300ms delay
    [trigger]
  );

  // Cleanup 
  React.useEffect(() => {
    return () => {
      debouncedEnfocar.cancel();
    };
  }, [debouncedEnfocar]);

  return <div className='indice'>
    <ol>
      {entradas.map(e => <li
        key={ e.slug }
        onMouseEnter={() => {if (e.slug) debouncedEnfocar( e.slug )}}
        onMouseLeave={() => trigger.emit('unhover', e.slug )}
      >{e.titulo}</li>)}
    </ol>
    <div className='perilla'>

    </div>
  </div>
}