var app = angular.module('app', []);

app.controller('chatController', ['$scope', '$http', function ($scope, $http) {

  $scope.idUsuario = {};
  $scope.idRemitente = {};
  $scope.contactos = [];
  $scope.chat = {};

  $scope.init = function(idUsuario, nombrePersona){
      $scope.idUsuario = idUsuario;
      $scope.nombrePersona = nombrePersona;
      $scope.getContactos();
    }

    var socket = io.connect({'forceNew': true});
    $scope.messages = $scope.messages || [];
    $scope.mensaje = new Object();
    $scope.usuarios = [];

    socket.on('sendMessages', function (data) {
        $scope.messages = data.emitted.fulfill[0];
        $scope.$apply();
    });

    socket.on('sendMessage', function (data) {
        console.log("Ya mero");
        $scope.getMensajesChat($scope.idRemitente);
        console.log("si se pudo");
        $scope.$apply();
    });
    $scope.enviarMensajeNuevo = function () {

        $scope.mensaje.nombrePersona = $scope.nombrePersona;
        console.log($scope.mensaje);
        socket.emit('newMessage', $scope.mensaje, $scope.chat);

    }

    $scope.getUsuarios = function(){
      $http.get("/findUsuarios").success(function(data){
        $scope.usuarios = data;
      });
    };

    $scope.getContactos = function(){
      $http.get("/findContactos/"+ $scope.idUsuario).success(function(data){
        if(data) $scope.contactos = data;
      });
    };

    $scope.getMensajesChat = function(id){
      console.log("idUsuario-----> " + $scope.idUsuario);
      $scope.idRemitente = id;
      console.log("idRemitente-----> " + id);
      $http.get("/getChat/"+ $scope.idUsuario + "/" + id).success(function(data){
        if(data) $scope.chat = data;
      });
    };

    $scope.agregarContacto = function(id){
      console.log(id);
      $http({
        url:'/contacto/agregar',
        method:'POST',
        data: {idUsuario:$scope.idUsuario,
        idDestinatario:id}
      }).then(function(data){
        $scope.getContactos();
      }, function(data){
        //TODO:Error
      });
    };
}]);
