import os
import codecs

for fn in os.listdir('public/texts/'):
    orig = codecs.open('public/texts/' + fn, 'r', 'cp1252').read()
    titu = fn.lower().replace(' ','_')
    dest = codecs.open('public/md/' + titu, 'w', 'utf-8')
    dest.write(orig.replace('&quot;','"'))
