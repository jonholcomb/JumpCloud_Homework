const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const uuidv4 = require('uuid/v4'); 

exports.handler = (event, context, callback) => {

    // Callback to finish response
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '204',
        body: err ? err.message : '',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    switch (event.httpMethod) {
        case 'POST':
            var reqJson = JSON.parse(event.body, (key, value) => {
                  if (value === null || value === '') {
                    return "NA";
                  }
                  return value;
            });
            if(!reqJson.hasOwnProperty('csp-report')) {
                done();
                break;
            }
            var item = reqJson["csp-report"];
            item.id = uuidv4();
            item.timestamp = new Date().getTime().toString();
            dynamo.putItem({
                TableName: process.env.table,
                Item: item
            }, done);
            break;
        default:
            done(new Error('Unsupported method'));
    }
};