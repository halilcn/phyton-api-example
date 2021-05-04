from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
data = [{
    'point_name': 'alan 1',
    'point_latitude': '-25.344',
    'point_longitude': '131.036'
}, {
    'point_name': 'alan 2',
    'point_latitude': '-1.323',
    'point_longitude': '160.01'
}]

@app.route('/api/data', methods=['GET'])
def returnData():
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def setData():
    requestData = request.get_json()
    data.append({
        'point_name': requestData['point_name'],
        'point_latitude': requestData['point_latitude'],
        'point_longitude': requestData['point_longitude']
    })
    return jsonify({'status': 'true'}), 201

@app.route('/api/data/<string:index>', methods=['DELETE'])
def deleteData(index):
    if data.pop(int(index)):
        return jsonify({'status': 'true'})
    else:
        return jsonify({'status': 'false'}), 400

@app.route('/api/data/<string:index>', methods=['PUT'])
def updateData(index):
    requestData = request.get_json()
    data[int(index)]['point_name'] = requestData['point_name']
    data[int(index)]['point_latitude'] = requestData['point_latitude']
    data[int(index)]['point_longitude'] = requestData['point_longitude']
    return jsonify({'status': 'true'})


if __name__ == '__main__':
    app.run()
