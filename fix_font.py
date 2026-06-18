import re
f=open(r'd:\Toilet\toilet_partition_auto_generator.html','r',encoding='utf-8')
s=f.read()
f.close()
s=s.replace("var(--font-sans)","'Microsoft YaHei', Arial, sans-serif")
f=open(r'd:\Toilet\toilet_partition_auto_generator.html','w',encoding='utf-8')
f.write(s)
f.close()
print('done')