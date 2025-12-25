import EventEmitter from 'events';
import { capitalize, debounce, groupBy } from 'lodash';
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

  const grupos = groupBy(entradas, e => e.fm?.serie || 'otros');

  return <div className='indice'>
    <ol>
      {Object.entries(grupos).map(([serie, entradasSerie]) => (
        <li key={ serie }>
          <strong>{ serie !== 'otros' ? capitalize(serie) : 'Otros escritos' }</strong>
          <ol>
            {entradasSerie.map(e => <li
              key={ e.slug }
              onMouseEnter={() => {if (e.slug) debouncedEnfocar( e.slug )}}
              onMouseLeave={() => trigger.emit('unhover', e.slug )}
            >{e.titulo}</li>)}
          </ol>
        </li>
      ))}
    </ol>
    {/* <ol>
      {entradas.map(e => <li
        key={ e.slug }
        onMouseEnter={() => {if (e.slug) debouncedEnfocar( e.slug )}}
        onMouseLeave={() => trigger.emit('unhover', e.slug )}
      >{e.titulo}</li>)}
    </ol> */}

  </div>
}