const fs = require('fs/promises')

let rectificar = async (base = './public/textos/') => {
  let mds = await fs.readdir(base)
  for (let md of mds){
    let st = await fs.stat(base+md)
    if(st.isDirectory()){
      await rectificar(base+md+'/')
    }else{
      console.log(`Movería ${base+md} a ${(base+md).split('_').join('-')}`)
      await fs.rename(base+md, (base+md).split('_').join('-'))
    }
  }
  return 'ta'
}

rectificar().then(console.log)
