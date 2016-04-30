var app = angular.module('appSockets',[]);

app.controller("chatCtrl",function($scope){
  var socket = io.connect({'forceNew':true});

  $scope.mensajes=[];
  $scope.obj = new Object();

  $scope.enviarMensajeNuevo = function(){
      socket.emit('mensajeNuevo', $scope.obj);
  };

  socket.on('enviarMensajes', function(data){
    $scope.mensajes = data;
    console.log(data);
    $scope.$apply();
  });
});

app.controller('contactosCtrl',function($scope){
  $scope.contacto=
                    {
                      nombre: "Popo",
                      ultimoMensaje: "asdxfcgvjhmggndfb",
                      fecha: new Date('2016','04','14'),
                      imagen:"http://bootdey.com/img/Content/user_1.jpg"
                    }
                  ;
});
