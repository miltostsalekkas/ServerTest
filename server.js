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
var IDs = [];
var PublicData = [];
var PublicGridData = [];
var Positions = [];

io.on('connection',
  // We are given a websocket object in our function
  function (socket) {



    console.log("We have a new client: " + socket.id);
    Users = Users + 1;
    console.log("Number od Users : " + Users);

    const color = colors[Math.floor(Math.random() * colors.length)];



    IDs.push(socket.id);

    socket.on('grid',
      function (data) {
        for (var i = 0; i < IDs.length; i++) {
          if (data[IDs[i]] != null) {
            Positions.push((AssisgnRandomPixel(data[IDs[i]].x, data[IDs[i]].y)));
            console.log(Positions);
          }
        }
      }
    );


    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mic',
      function (data) {


        if (data != null) {

          for (var i = 0; i < IDs.length; i++) {
            if (data[IDs[i]] != null) {
              data[IDs[i]].color = color;
              data[IDs[i]].position = Positions[i];
              PublicData[i] = { [IDs[i]]: data[IDs[i]] };
            }
          }




          socket.emit('Public', PublicData);

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

function AssisgnRandomPixel(columnsNo, rowsNo) {



  var RPixelEntry = {

    x: Math.floor(Math.random() * columnsNo),
    y: Math.floor(Math.random() * rowsNo)

  };


  return RPixelEntry;
}
