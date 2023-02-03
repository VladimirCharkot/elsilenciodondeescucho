
export const post = async (endpoint: string, payload: Record<string, any>, parseResponse = (r: Response) => r.json()) => {
  try{
    console.log(`Fetching ${endpoint}`)
    const response = await fetch(endpoint,{
      method: 'post',
      body: JSON.stringify(payload),
      headers: {'Content-type' : 'application/json'}
      })
    if (response.status != 200)
      console.warn(`Mal status en post(${endpoint})`)
    const j = await parseResponse(response);
    console.log(`Got response...`)
    console.log(j)
    return j
  }catch(err){
    console.error(`Error en post(${endpoint}, ${payload})`)
    throw err
  }
}

export const get = async <T>(endpoint: string, parseResponse = (r: Response) => r.json()): Promise<T> => {
  try{
    let response = await fetch(endpoint)
    if (response.status != 200) { console.warn(`Mal status en get(${endpoint})`) }
    const j = await parseResponse(response)
    return <T>j;
  }catch(err){
    console.error(`Error en get(${endpoint})`)
    throw err
  }
}

export const del = async (endpoint: string, parseResponse = (r: Response) => r.json()) => {
  try{
    let response = await fetch(endpoint, { method: 'delete' })
    if (response.status != 200)
      console.warn(`Mal status en del(${endpoint})`)
    let j = await parseResponse(response)
    return j
  }catch(err){
    console.error(`Error en del(${endpoint})`)
    throw err
  }
}

export const postFiles = async (endpoint: string, files: FileList, parseResponse = (r: Response) => r.json()) => {
  try{

    const data = new FormData();
    for(let i = 0; i < files.length; i++){
      console.log(files[i])
      data.append(`foto_${i}`, files[i])
    }

    const response = await fetch(endpoint, {method: 'post', body: data})
    if (response.status != 200)
      console.warn(`Mal status en postFiles(${endpoint})`)

    const j = await parseResponse(response);
    return j;

  }catch(err){
    throw err
  }

}

export const logaccess = async (accion: string) => {
  return (await post('/accion', {accion})).ok
}