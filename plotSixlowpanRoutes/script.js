var app = angular.module('plunker', ['chart.js']);

app.controller('MainController', function($scope, $http) {

  var canvas=document.getElementById("canvas");
  var ctx=canvas.getContext("2d");
  var cw=canvas.width;
  var ch=canvas.height;



  var line = document.getElementById("line");
  var ctx1 = line.getContext("2d");
  console.log(ctx1);

  Chart.defaults.global.animation = false;
  Chart.defaults.global.scaleFontSize = 28;

  Chart.defaults.Line.pointDotRadius = 15;
  console.log(Chart.defaults.global);
  console.log(Chart.defaults.Line);
  var tx_data = [];
  var rx_data = [];

  // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ["TX", "RX"];

            // $scope.fillColor = "rgba(255,0,0,0.2)",
            // $scope.strokeColor = "rgba(255,0,0,1)",
            // $scope.pointColor = "rgba(255,0,0,1)",
  // $scope.data = [
  //   [65, 59, 80, 81, 56, 55, 40]
  // ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  var it = 0;
  var label = [];
  setInterval(function() {
      $http.get('/networkStats').success(function(res) {
        tx_data.push(res.tx);
        rx_data.push(res.rx);
        if(tx_data.length > 100) {
          tx_data.shift();
          rx_data.shift();
          label.shift();
        }
        label.push( (it++).toString());
        console.log(label, res.tx);
        $scope.opts = {
            "fillColor": "rgba(255,0,0,0.2)",
            "strokeColor": "rgba(255,0,0,1)",
            "pointColor": "rgba(255,0,0,1)",
            "pointStrokeColor": "#fff",
            "pointHighlightFill": "#fff",
            "pointHighlightStroke": "rgba(255,0,0,1)"
        }
        // it++;
        $scope.data = [ tx_data, rx_data ];
        $scope.labels = label;
      });
  }, 1000);
  
  $scope.routes = null;
  var routes = null;

  var m = [];
  var previousNum;
  var callAgain = 0;
  var active = 'NO'

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

  // this.interval = setInterval(function(){

    function getRoutes() {

      $http.get('/routes').success(function(res) {
        ctx.clearRect(0, 0, cw, ch);
        $scope.routes = res;
        routes = res;
        active = 'Yes';

        var root_x = 700;
        var root_y = 700;
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
        var directlyConnected = 0;
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
            ln = 12;
          } else {
            ln = 20;
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
            directlyConnected++;
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
          // ctx.fillText('rank: ' + routes[node].data['rank'], m[node][0] - 4*radius , m[node][1] + 6*radius + 2*radius)
          Object.keys(routes[node].data).forEach(function(key, index, array) {
            ctx.fillText(key + ': ' + routes[node].data[key], m[node][0] - 4*radius , m[node][1] + 6*radius + index*2*radius)
          })
          ctx.font= "30px Arial";
          ctx.fillText('Active Nodes: ' + numOfNodes, 1500 , 700)
          if(n == array.length - 1) {
            ctx.fillText('Directly Connected: ' + directlyConnected, 1500 , 725);
            callAgain = 1;
          }
          ctx.stroke();

          drawEdge(parent, {x: m[node][0], y: m[node][1]}, '');
          if(callAgain) {
            // active = 'No'
            callAgain = 0;
            setTimeout(function() {
              getRoutes();
            }, 1000)
          }
        });

      });
    }

    getRoutes();
    // setInterval(function() {
    //   ctx.beginPath();
    //   ctx.font= "30px Arial";
    //   ctx.fillStyle="black";
    //   ctx.fillText('Active: ' + active, 1500 , 750)
    //   ctx.stroke();
    // }, 100);

    // setInterval(function() {
    //   active = 'No';
    // }, 2000);
  // }, 1000);
});