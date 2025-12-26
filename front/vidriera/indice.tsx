import { capitalize, debounce, groupBy } from 'lodash'
import * as React from 'react'
import { useVidriera } from './contexto'

export default function Indice() {
  const { nodos, setEnfocado } = useVidriera()

  // Debounce de hover
  const debouncedEnfocar = React.useMemo(
    () =>
      debounce((slug: string) => {
        setEnfocado(slug)
      }, 300), // 300ms delay
    [setEnfocado]
  )

  // Cleanup
  React.useEffect(() => {
    return () => {
      debouncedEnfocar.cancel()
    }
  }, [debouncedEnfocar])

  const grupos = groupBy(nodos, (e) => e.fm?.serie || 'otros')

  return (
    <div className="indice">
      <ol>
        {Object.entries(grupos).map(([serie, entradasSerie]) => (
          <li key={serie}>
            <strong>{serie !== 'otros' ? capitalize(serie) : 'Otros escritos'}</strong>
            <ol>
              {entradasSerie.map((e) => (
                <li
                  key={e.slug}
                  onMouseEnter={() => {
                    if (e.slug) debouncedEnfocar(e.slug)
                  }}
                  onMouseLeave={() => setEnfocado(null)}
                >
                  {e.titulo}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  )
}
