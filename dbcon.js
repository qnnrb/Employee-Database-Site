var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_robertsq',
  password        : '9388',
  database        : 'cs340_robertsq'
});
module.exports.pool = pool;
