angular.module('app').service('TempService', TempService);

TempService.$inject = ['$http', '$q'];

function TempService($http, $q) {
    return {
        getTemps: getTemps,
        getTempsByDate: getTempsByDate
    };

    function getTemps() {
        var deferred = $q.defer();
        $http.get('http://localhost/brewlog/api/temp').then(function(response) {
            deferred.resolve(response.data.data);
        }, function() {
            deferred.reject();
        });

        return deferred.promise;

    }

    function getTempsByDate(fromDate, toDate) {
        console.assert(fromDate);
        var deferred = $q.defer();
        var url = 'http://localhost/brewlog/api/temp?fromDate=' + fromDate;
        if(toDate) {
            url += '&toDate=' + toDate;
        }
        $http.get(url).then(function(response) {
            deferred.resolve(response.data.data);
        }, function() {
            deferred.reject();
        });

        return deferred.promise;
    }
}