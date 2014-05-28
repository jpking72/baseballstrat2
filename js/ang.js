var baseballApp = angular.module('baseballApp', []);


baseballApp.factory('socket', function ($rootScope) {

	var socket = io.connect('http://local.baseball.com:3333');

	return {

		on: function (eventName, callback) {

			socket.on(eventName, function () {

				var args = arguments;

				$rootScope.$apply( function () {

					callback.apply(socket, args);

				})
			})
		},

		emit : function (eventName, data, callback) {

			socket.emit(eventName, data, function () {

				var args = arguments;

				$rootScope.$apply(function () {

					if (callback) {

						callback.apply(socket, args)
;					}
				});
			})

		}

	}


})

function MainCtrl ($scope, socket) {

	$scope.message = '';
	$scope.messages = [];

	socket.on('new:msg', function (message) {
		$scope.messages.push(message);
	})

	$scope.broadcast = function() {

		socket.emit('broadcast:msg', { message : $scope.message })

		$scope.messages.push($scope.message);
		$scope.message = '';
		
	}


}
