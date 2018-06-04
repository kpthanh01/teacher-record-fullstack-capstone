exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:12345a@ds147890.mlab.com:47890/teacher-record';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://demo:12345a@ds147890.mlab.com:47890/teacher-record';
exports.PORT = process.env.PORT || 8080;