import re
f=open(r'd:\Toilet\toilet_partition_auto_generator.html','r',encoding='utf-8')
s=f.read()
f.close()
# Fix JS string quote conflict: ctx.font='30px 'Microsoft YaHei', Arial, sans-serif'
# -> ctx.font="30px 'Microsoft YaHei', Arial, sans-serif"
s = re.sub(r"ctx\.font='(30px|bold 30px) 'Microsoft YaHei', Arial, sans-serif'", r'ctx.font="\1 \'Microsoft YaHei\', Arial, sans-serif"', s)
# Also handle ctx.font = '...'
s = re.sub(r"ctx\.font = '(30px|bold 30px) 'Microsoft YaHei', Arial, sans-serif'", r'ctx.font = "\1 \'Microsoft YaHei\', Arial, sans-serif"', s)
f=open(r'd:\Toilet\toilet_partition_auto_generator.html','w',encoding='utf-8')
f.write(s)
f.close()
print('done')