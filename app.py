from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def criar_banco():
    conn = sqlite3.connect('ranking.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS ganhadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            pontos INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

criar_banco()

@app.route('/ganhadores', methods=['GET'])
def listar_ganhadores():
    conn = sqlite3.connect('ranking.db')
    c = conn.cursor()
    c.execute('SELECT nome, pontos FROM ganhadores ORDER BY id DESC')
    ganhadores = [{'nome': row[0], 'pontos': row[1]} for row in c.fetchall()]
    conn.close()
    return jsonify(ganhadores)

@app.route('/ganhadores', methods=['POST'])
def adicionar_ganhador():
    data = request.get_json()
    nome = data.get('nome', 'Anônimo')
    pontos = data.get('pontos', 0)
    conn = sqlite3.connect('ranking.db')
    c = conn.cursor()
    c.execute('INSERT INTO ganhadores (nome, pontos) VALUES (?, ?)', (nome,pontos))
    conn.commit()
    conn.close()
    return jsonify({'status':'ok'})

if __name__ == '__main__':
    app.run(debug=True)
