var app = angular.module('plunker', []);

app.controller('MainController', function($scope, $http) {

  var canvas=document.getElementById("canvas");
  var ctx=canvas.getContext("2d");
  var cw=canvas.width;
  var ch=canvas.height;

  $scope.routes = null;
  var routes = null;

  var m = [];
  var previousNum;

  $scope.sixlbrConfig = null;
  $scope.nvm_data = null

  $http.get('/sixlbrConfig').success(function(res) {
    $scope.sixlbrConfig = res;
    $scope.nvm_data = res.nvm_data;
  });

  $scope.pushSixlbrConfig = function() {
    console.log($scope.sixlbrConfig);
    var sixlbrConfig = $scope.sixlbrConfig;
    sixlbrConfig.nvm_data = $scope.nvm_data;
    $http.post('/updateSixlbrConfig', sixlbrConfig).then(function(resp) {
      console.log('update successful - ', resp);
    }, function(err) {
      console.error('http post- updateSixlbrConfig failed ', err);
    });
  }

  $scope.isNumber = function(val) {
    return typeof val == 'number'
  }

  this.interval = setInterval(function(){

    $http.get('/routes').success(function(res) {
      ctx.clearRect(0, 0, cw, ch);
      $scope.routes = res;
      routes = res;

      var root_x = 500;
      var root_y = 500;
      var radius = 5;
      var font = "10px Arial";

      var factor = 30;

      ctx.beginPath();
      ctx.arc(root_x, root_y, radius*2, 0, 2 * Math.PI);
      ctx.fillStyle="blue";
      ctx.fill();

      function drawEdge(to, from, ln) {
        ctx.beginPath();
        ctx.lineJoin="round";
        ctx.moveTo(to.x,to.y);
        ctx.lineTo(from.x,from.y);
        ctx.fillText(ln, (to.x + from.x) / 2, (to.y + from.y ) / 2);
        ctx.stroke();
      }

      var numOfNodes = Object.keys(routes).length;
      if(previousNum != numOfNodes) {
        m = [];
        previousNum = numOfNodes;
      }

      var deg = 360/numOfNodes;
      var x = (3.14/180)*deg;  //radians
      var n = 0;
      var ln = 5;

      console.log('ROUTES: ', routes);
      
      Object.keys(routes).forEach(function(node, n, array) {
        var via = routes[node].parentId;

        //alternate length
        if((n % 2) == 0) {
          ln = 9;
        } else {
          ln = 15;
        }

        if(typeof m[node] == 'undefined') {
          m[node] = [];
          m[node][0] = ln * Math.cos(n*x) * factor + root_x;
          m[node][1] = ln * Math.sin(n*x) * factor + root_y;
        }


        // console.log('vertice: ', m[node] + ' n: ', n + ' ln: ', ln + ' node: ', node);

        var parent = {};
        // console.log('via: ', via);
        if(via === node) {
          //connected directly to root
          parent = {
            x: root_x,
            y: root_y
          }
        } else {
          //connected to via
          if(typeof m[via] != 'undefined' ) {
            parent = {
              x: m[via][0],
              y: m[via][1]
            }
          } else {

          }
        }

        // console.log('parent: ', parent);

        ctx.beginPath();
        ctx.arc(m[node][0], m[node][1], radius, 0, 2 * Math.PI);
        ctx.fillStyle="red";
        ctx.fill();
        ctx.font= font;
        ctx.fillStyle="black";
        ctx.fillText(node, m[node][0] - 3*radius , m[node][1] + 4*radius);
        Object.keys(routes[node].data).forEach(function(key, index, array) {
          ctx.fillText(key + ': ' + routes[node].data[key], m[node][0] - 4*radius , m[node][1] + 6*radius + index*2*radius)
        })
        ctx.stroke();

        drawEdge(parent, {x: m[node][0], y: m[node][1]}, '');
      });

    });
  }, 200);
});