from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
'Default Api Settings ??'
CORS(app)

data = [{
    'point_name': 'veri1',
    'point_latitude': 'veri2',
    'point_longitude': 'veri3'
}, {
    'point_name': 'veri1',
    'point_latitude': 'veri2',
    'point_longitude': 'veri3'
}]


@app.route('/api/data', methods=['GET'])
def returnData():
    return jsonify(data), 201


@app.route('/api/data/delete/<string:index>', methods=['DELETE'])
def deleteData(index):
    if data.pop(int(index)):
        return jsonify({'status': 'true'})
    else:
        return jsonify({'status': 'false'}), 400


"""
 deneme = request.args.get('dejene')
    return jsonify(data='deneme değeri'), 201
@app.route("/deneme>", classmethod=['POST'])
def api():
    return jsonify(data='post çalışıyor'), 201
"""

if __name__ == '__main__':
    app.run()
