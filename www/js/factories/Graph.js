angular.module('controlApp.GraphFactory', [])
  .factory('Graph', function () {
    var options = {
      chart: {
        type: 'lineChart',
        height: 350,
        margin: {
          top: 10,
          right: 5,
          bottom: 40,
          left: 40
        },
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        //forceY: [0, 100],
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function (e) {
            console.log("stateChange");
          },
          changeState: function (e) {
            console.log("changeState");
          },
          tooltipShow: function (e) {
            console.log("tooltipShow");
          },
          tooltipHide: function (e) {
            console.log("tooltipHide");
          }
        },
        xAxis: {
          axisLabel: 'Time (s)',
          axisLabelDistance: 0.5,
        },
        yAxis: {
          tickFormat: function (d) {
            return d3.format('.02f')(d);
          },
          axisLabelDistance: 1
        },
      }
    };

    return {
      options: options,
    }
  });
