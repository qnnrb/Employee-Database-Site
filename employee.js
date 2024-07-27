module.exports = function(){
   var express = require('express');
   var router = express.Router();

   function getProjects(res, mysql, context, complete){
      mysql.pool.query("SELECT Pnumber, Pname FROM PROJECT", function(error, results, fields){
         if(error){
	    res.write(JSON.stringify(error));
	    res.end();
         }   
         context.project = results;
         complete();
      });
   }

   function getEmployees(res, mysql, context, complete){
      mysql.pool.query("SELECT Fname, Lname, Salary, Dno FROM EMPLOYEE", function(error, results, fields){
         if(error){
	    res.write(JSON.stringify(error));
	    res.end();
         }
	 console.log("inside getEmployees");
         //context.employee = JSON.stringify(results);
	 context.employee = results;
         complete();
      });
   }

   function getEmployeesbyProject(req, res, mysql, context, complete){
      var query = "SELECT Fname, Lname, Salary, Dno FROM EMPLOYEE INNER JOIN WORKS_ON ON Ssn = WORKS_ON.Essn WHERE WORKS_ON.Pno = ?";
      console.log(req.params)
      var inserts = [req.params.project]
      mysql.pool.query(query, inserts, function(error, results, fields){
         if(error){
	    res.write(JSON.stringify(error));
	    res.end();
         }  
         context.employee = results;
         complete();
      });
   }

   function getProjectInfo(res, mysql, context, id, complete){
      var sql = "SELECT Pnumber, Pname, Plocation FROM PROJECT WHERE Pnumber = ?";
      var inserts = [id];
      mysql.pool.query(sql, inserts, function(error, results, fields){
         if(error){
	    res.write(JSON.stringify(error));
	    res.end();
         }
    	 context.projectInfo = results[0];
         complete();
      });
   }  

   function getEmployeeWithNameLike(req, res, mysql, context, complete){
      var query = "SELECT Fname, Lname, Salary, Dno FROM EMPLOYEE WHERE Fname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
         if(error){
	    res.write(JSON.stringify(error));
	    res.end();
         }
	 context.name = req.params.s;
         context.employee = results;
         complete();
      });
   }

   router.get('/', function(req,res){
      var callbackCount = 0;
      var context = {};
      var mysql = req.app.get('mysql');
      context.jsscripts = ["filterEmployee.js", "searchEmployee.js"];
      getEmployees(res, mysql, context, complete);
      getProjects(res, mysql, context, complete);

      function complete(){
         callbackCount++;
         if(callbackCount >= 2){
	    res.render('employee', context);
         }
      }
   }); 

   /*router.get('/employee', function(req, res, next){
      var context = {};
      
      mysql.pool.query('SELECT Fname, Lname, Salary, Dno from EMPLOYEE', function(err, rows, fields){
	 res.render('employee', {employee: rows});
      });
   }); */

   
   router.get('/filter/:project', function(req,res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["filterEmployee.js", "searchEmployee.js"];
      var mysql = req.app.get('mysql');
      getEmployeesbyProject(req, res, mysql, context, complete);
      console.log("project = ", req.params.project);
      //getProjectInfo(res, mysql, context, req.params.project, complete);
      getProjects(res, mysql, context, complete);
      function complete(){
         callbackCount++;
         if(callbackCount >= 2){
	    res.render('employee', context);
         }
      }
   });

   router.get('/search/:s', function(req,res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["filterEmployee.js", "searchEmployee.js"];
      var mysql = req.app.get('mysql');
      getEmployeeWithNameLike(req, res, mysql, context, complete);
      getProjects(res, mysql, context, complete);
      function complete(){
         callbackCount++;
         if(callbackCount >= 2){
	    res.render('employee', context);
         }
      }
   });
   
   return router;
}();
