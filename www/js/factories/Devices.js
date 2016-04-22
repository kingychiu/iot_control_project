angular.module('controlApp.DevicesFactory', [])
  .factory('Devices', function () {
    var colors = ['#b4fb29', '#358dd6', '#c7054e', '#a0aaff'];

    function getColor(id){
      return colors[id%colors.length]
    }

    var devices = [{
      id: 0,
      name: 'Washroom Module',
      updateDate: '2016-10-10',
      color: getColor(0),
      data:[
        {name: 'temperature', value: 0},
        {name: 'humanity', value: 0},
        {name: 'fanspeed', value: 0},
      ],
      extra:[],
      controls:[
        {name:'Fan Speed', type:'value', value:0},
        {name:'Door Lock', type:'toggle', value:0},
      ]
    }, {
      id: 1,
      name: 'Security Module',
      updateDate: '2016-10-10',
      color: getColor(1),
      data:[],
      extra:[
        {type:'Photos', value:'https://events.google.com/io2016/images/io16-social.jpg', time:'11:50'},
        {type:'Photos', value:'https://events.google.com/io2016/images/io16-social.jpg', time:'11:50'},
        {type:'Photos', value:'https://events.google.com/io2016/images/io16-social.jpg', time:'11:50'},
        {type:'Photos', value:'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg', time:'11:50'},
        {type:'Photos', value:'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg', time:'11:50'},
        {type:'Photos', value:'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg', time:'11:50'},
      ],
      controls:[]
    }, {
      id: 2,
      name: 'Power Monitor Module',
      updateDate: '2016-10-10',
      color: getColor(2),
      data:[],
      extra:[],
      controls:[]
    }, {
      id: 3,
      name: 'Lighting Module',
      updateDate: '2016-10-10',
      color: getColor(3),
      data: [],
      extra:[],
      controls:[]
    }
    ];

    return {
      all: function () {
        return devices;
      },
      remove: function (d) {
        devices.splice(devices.indexOf(chat), 1);
      },
      get: function (id) {
        for (var i = 0; i < devices.length; i++) {
          if (devices[i].id === parseInt(id)) {
            for(var j = 0; j < devices[i].data.length; j++){
              devices[i].data[j].value = Math.floor((Math.random() * 10) + 1);
            }
            return devices[i];
          }
        }
        return null;
      }
    };
  });
