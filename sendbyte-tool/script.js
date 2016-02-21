var app = angular.module('plunker', []);

app.controller('MainController', function($scope, $http) {

    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    var cw=canvas.width;
    var ch=canvas.height;

    $scope.rssi_map = null;
    var rssi_map = null;

                this.interval = setInterval(function(){

                    $http.get('/localizationMap').success(function(res) {
                        ctx.clearRect(0, 0, cw, ch);
                    $scope.rssi_map = res;
                    rssi_map = res;
                    console.log(rssi_map);

                    var root_x = 500;
                    var root_y = 500;
                    var radius = 10;
                    var font = "10px Arial";

                    var factor = 50;

                    ctx.beginPath();
                    ctx.arc(root_x, root_y, radius, 0, 2 * Math.PI);
                    ctx.fillStyle="blue";
                    ctx.fill();

                    function multiply(a, b) {
                        var aNumRows = 2, aNumCols = 2,
                            bNumRows = 2, bNumCols = 1,
                            m = new Array(aNumRows);  // initialize array of rows
                        for (var r = 0; r < aNumRows; ++r) {
                            m[r] = new Array(bNumCols); // initialize the current row
                            for (var c = 0; c < bNumCols; ++c) {
                                m[r][c] = 0;             // initialize the current cell
                                for (var i = 0; i < aNumCols; ++i) {
                                    m[r][c] += a[r][i] * b[i][c];
                                }
                            }
                        }
                        return m;
                    }

                    function drawEdge(to, from, ln) {
                      ctx.beginPath();
                      ctx.lineJoin="round";
                      ctx.moveTo(to.x,to.y);
                      ctx.lineTo(from.x,from.y);
                      ctx.fillText(ln, (to.x + from.x) / 2, (to.y + from.y ) / 2);
                      ctx.stroke();
                    }

                    var numOfNodes = 5;
                    var deg = 360/numOfNodes;
                    var x = (3.14/180)*deg;  //radians
                    var n = 0;
                    Object.keys(rssi_map).forEach(function(key) {

                        // var a = [[Math.cos(n*x), - Math.sin(n*x)], [Math.sin(n*x), Math.cos(n*x)]];
                        // var b = [[rssi_map[key]], [0]];
                        var m = [];
                        m[0] = rssi_map[key] * Math.cos(n*x) * factor + root_x;
                        m[1] = rssi_map[key] * Math.sin(n*x) * factor + root_y;

                        console.log('rssi value: ', rssi_map[key]);
                        // var m = multiply(a, b);
                        console.log('vertice: ', m);
                        // console.log(m);

                        ctx.beginPath();
                        ctx.arc(m[0], m[1], radius, 0, 2 * Math.PI);
                        ctx.fillStyle="red";
                        ctx.fill();
                          ctx.font= font;
                          ctx.fillText(key, m[0] - radius/2 , m[1] + 2*radius);
                          ctx.stroke();

                        drawEdge({x: root_x, y: root_y}, {x: m[0], y: m[1]}, rssi_map[key]);
                        n++;
                    });
                });}, 200);

                //this.endLongPolling = function(){ clearInterval(this.interval);};
});