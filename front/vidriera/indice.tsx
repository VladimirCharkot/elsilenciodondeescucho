import * as React from 'react';
import { Menu, NodoVidriera } from './tipos';
import EventEmitter from 'events';

interface IndiceProps {
  menu: Menu;
  trigger: EventEmitter;
}

export default function Indice({ menu, trigger }: IndiceProps) {
  const [entradas, setEntradas] = React.useState<NodoVidriera[]>([]);

  React.useEffect(() => {
    menu().then(setEntradas);
  }, [menu])

  return <div className='indice'>
    <ol>
      {entradas.map(e => <li
        key={ e.slug }
        onMouseEnter={() => trigger.emit('hover', e.slug )}
        onMouseLeave={() => trigger.emit('unhover', e.slug )}
      >{e.titulo}</li>)}
    </ol>
    <div className='perilla'>

    </div>
  </div>
}