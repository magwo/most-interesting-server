(function () {
    var appModule = angular.module('misApp', []);


    appModule.controller('LinesController', function($scope, $timeout) {
        $scope.delayFactor = 1.0;
        $scope.timeoutId = undefined;
        $scope.lines = [];

        $scope.playToggle = function(value) {
            if(typeof $scope.timeoutId != "undefined") {
                $timeout.cancel($scope.timeoutId);
                $scope.timeoutId = undefined;
            }
            else {
                $scope.step();
            }
        };
        $scope.turboToggle = function() {
            if($scope.delayFactor < 1.0) {
                $scope.delayFactor = 1.0;
            } else {
                $scope.delayFactor = 0.00001;
            }
        };

        $scope.cullOldEntries = function(triggerLimit, limitTo) {
            if($scope.lines.length > triggerLimit) {
                $scope.lines = $scope.lines.slice(0, limitTo);
            }
        };

        $scope.addRandomLines = function() {
            newLines = server.getRandomLines();
            var styleClass = server.getRandomClass(newLines.length);
            newLines = newLines.map(function(line) { return { text: line, class: styleClass, timestamp: moment.utc() } });
            $scope.lines = newLines.concat($scope.lines.concat());
        }

        $scope.step = function() {
            $scope.addRandomLines();
            $scope.cullOldEntries(300, 250);

            var delay = 5 + 2600 * Math.random() * Math.random() * Math.random() * Math.random();
            delay *= $scope.delayFactor;
            $scope.timeoutId = $timeout(function() {
                $scope.step();
            }, delay);
        }

        $scope.step();
    });

    // function addLines(lines) {
    //     var styleClass = server.getRandomClass(lines.length);
    //     $.each(lines, function() {
    //         var text = this;
    //         var newElem = $("<p></p>");
    //         var textElem = $("<span> " + text + "</span>");
    //         textElem.addClass(styleClass);
    //         var serverName = "mis-01"
    //         newElem.append("<span>[" + moment().format("HH:mm:ss") + " " + serverName + " (UTC " + moment.utc().format("HH:mm") + ")]</span>");
    //         newElem.append(textElem);
    //         $("#body_console").prepend(newElem);
    //     });
    // }



    // var currentTimeoutId = undefined;
    // var counter = 0;
    // function doStuff() {
    //     var delay = 5 + 2600 * Math.random() * Math.random() * Math.random() * Math.random();
    //     delay *= delayFactor;
    //     currentTimeoutId = setTimeout(function() {
    //         addLines(server.getRandomLines());
    //         counter++;
    //         if(counter % 20 == 0) {
    //             cullOldEntries();
    //         }
    //         doStuff();
    //     }, delay);
    // }

    // // When ready, go go go
    // $(function() {
    //     if(window.location.search.match("controls")) {
    //         $("#controls").show();
    //     }
    //     doStuff();

    //     var lastLineCount = counter;
    //     var lastTime = moment();
    //     setInterval(function() {
    //         var currentTime = moment();
    //         duration = currentTime - lastTime;
    //         lps = (counter - lastLineCount) / (duration / 1000.0);
    //         $("#controls #lps").text("" + Math.round(lps) + " L/S");
    //         lastTime = currentTime;
    //         lastLineCount = counter;
    //     }, 3000);

    //     $("#controls #play_pause").click(function () {
            
    //     });
    // })
})();
