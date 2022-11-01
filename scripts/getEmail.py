import unicodedata, re, json
from pymongo import MongoClient

client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.liber

file = open('scripts/names.txt', 'r', encoding="utf-8")
names = file.read().split(',')
fake_datas = []
emails = []
def removerAcentosECaracteresEspeciais(palavra):
    # Unicode normalize transforma um caracter em seu equivalente em latin.
    nfkd = unicodedata.normalize('NFKD', palavra)
    palavraSemAcento = u"".join([c for c in nfkd if not unicodedata.combining(c)])
    # Usa expressão regular para retornar a palavra apenas com números, letras e espaço
    return re.sub('[^a-zA-Z0-9 \\\]', '', palavraSemAcento)

for name in names:
    if 'Sr.' in name or 'Sra.' in name or 'Dr.' in name or 'Dra.' in name or 'Srta.' in name:
        aux = name.split('. ')[0]
        name = name.replace(aux+'. ', '')
    new_name = removerAcentosECaracteresEspeciais(name)
    new_name = new_name.lower()
    email = new_name.split(' ')[0] + '.' +  new_name.split(' ')[-1] + '@gmail.com'
    if email in emails:
        print(email)
    else:
        emails.append(email)
        fake_datas.append(
            {
                'name': name,
                'email': email,
                'password': 'senha',
                'verified': True
            }
        )

for fake_data in fake_datas:
    json_object = json.dumps(fake_data, indent=4, ensure_ascii=False)
    with open("scripts/fake_datas.json", "a") as outfile:
        outfile.write(json_object)

print(fake_datas)