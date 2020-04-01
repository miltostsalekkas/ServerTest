'use strict';
const colors = require('riso-colors');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = 'index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

var Users = 0;
var IDs=[];
var PublicData = [];
var PublicGridData = [];

io.on('connection',
  // We are given a websocket object in our function
  function (socket) {



    console.log("We have a new client: " + socket.id);
    Users = Users + 1;
    console.log("Number od Users : " + Users);

    const color = colors[Math.floor(Math.random() * colors.length)];



    IDs.push(socket.id);



    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mic',
      function (data) {

        
        if (data != null) {

          for (var i = 0; i < IDs.length; i++) {
            if (data[IDs[i]] != null) {
              data[IDs[i]].color = color;
              data[IDs[i]].position = AssisgnRandomPixel(data[IDs[i]].Grid.x, data[IDs[i]].Grid.y, [IDs[i]]);
              PublicData[i] = { [IDs[i]]: data[IDs[i]] };
            }
          }




          socket.emit('Public', PublicData);
          socket.emit('PublicGridData', PublicGridData);

        }
      }
    );

    socket.on('disconnect', function () {

      IDs = IDs.filter(item => item !== socket.id);
      console.log("Client has disconnected");
      Users = Users - 1;
      console.log("Number of Users : " + Users);
    });
  }
);
var lastIndex;
var LastPixelEntry = { x: 0, y: 0 };
function AssisgnRandomPixel(columnsNo, rowsNo, index) {


  if (JSON.stringify(index) !== JSON.stringify(lastIndex)) {

    var RPixelEntry = {

      x: Math.floor(Math.random() * columnsNo),
      y: Math.floor(Math.random() * rowsNo)

    };
  }
  else {
    RPixelEntry = LastPixelEntry;
  }
  lastIndex = index;
  LastPixelEntry = RPixelEntry;
  return RPixelEntry;
}
