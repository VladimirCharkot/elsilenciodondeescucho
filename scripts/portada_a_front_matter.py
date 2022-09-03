import os
import re

base = '../public/textos/escritos/verdad/'

for fname in os.listdir(base):
    fn = base + fname
    print(f'Procesando {fn}')
    with open(fn) as f:
        contenido = f.read()
    m = re.findall(r'!\[(.+?)\]\((.+?)\)', contenido)
    if m:
        _, ruta = m[0]
        with open(fn, 'w') as f:
            contenido = re.sub('---([\s\S]+?)---', f'---\g<1>portada: {ruta}\n---', contenido, re.DOTALL)
            contenido = re.sub(r'!\[(.+?)\]\((.+?)\)', '', contenido)
            f.write(contenido)
