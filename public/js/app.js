var app = angular.module('appSockets',[]);

app.controller("chatCtrl", ['$scope', '$http', function ($scope, $http) {
  var socket = io.connect({'forceNew':true});

  $scope.mensajes=[];
  $scope.obj = new Object();

//Guarda
  $scope.enviarMensajeNuevo = function(){
      socket.emit('mensajeNuevo', $scope.obj);
  };

  socket.on('enviarMensajes', function(data){
  //recupera
     $http({
            method: 'GET',
            url: '/mensajes/all'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.mensajes = response.data;
            $scope.$apply();
        }, function errorCallback(response) {
            console.log("La rego el angular!!! :(");
            console.log(response);
        });
  });

  $scope.nuevoMensaje = function () {
        $scope.mensaje.texto = "";
    }
}]);

/*app.controller('contactosCtrl',function($scope){
  $scope.contacto=
                    {
                      nombre: "Popo",
                      ultimoMensaje: "asdxfcgvjhmggndfb",
                      fecha: new Date('2016','04','14'),
                      imagen:"http://bootdey.com/img/Content/user_1.jpg"
                    }
                  ;
});*/

app.controller("contactosCtrl", ['$scope', '$http', function ($scope, $http) {
  var socket = io.connect({'forceNew':true});

  $scope.contactos=[];
  $scope.obj = new Object();

//Guarda
  $scope.guardarContactoNuevo = function(){
      socket.emit('contactoNuevo', $scope.obj);
  };

  socket.on('guardarContacto', function(data){
  //recupera


    $http({
            method: 'GET',
            url: '/contactos/all'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.contactos = response.data;
            $scope.$apply();
        }, function errorCallback(response) {
            console.log("La rego el angular!!! :(");
            console.log(response);
        });
  });
}]);