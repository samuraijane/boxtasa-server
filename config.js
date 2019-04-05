exports.LOCAL_DB = 'mongodb://localhost/boxtasa';
exports.PORT = process.env.PORT || 3001;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '1d';
exports.CLOUD_DB = process.env.CLOUD_DB;
