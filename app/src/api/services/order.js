const service = (module.exports = {});

/**
 * Place a new order and subscribe to updates on the order&#39;s progress.
 * @param {object} ws WebSocket connection.
 */
service.subscribe = async (ws) => {
  ws.send(
    JSON.stringify({
      messageType: "open_connection",
      message: "You're connected! Send through an order to receive updates.",
    })
  );
};
/**
 * Receive messages from the Food Tracking API.
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.
 * @param {} options.message The received message.
 */
service.publish = async (ws, { message, path, query }) => {
  // Generate an Order ID
  var orderId = Math.ceil(Math.random() * 100);

  ws.send(
    JSON.stringify({
      orderId,
      messageType: "status_update",
      status: "placed",
    })
  );

  // Calculate a rough ETA that is between 10 and 40 minutes from now.
  var eta = new Date();
  eta.setMinutes(eta.getMinutes() + Math.ceil(Math.random() * 30 + 10));

  // Send the "preparing" message 4 seconds later
  setTimeout(function () {
    ws.send(
      JSON.stringify({
        orderId,
        messageType: "status_update",
        status: "preparing",
        eta: eta.toISOString(),
      })
    );

    // Send the "order_ready" message 5 seconds later
    setTimeout(function () {
      ws.send(
        JSON.stringify({
          orderId,
          messageType: "status_update",
          status: "order_ready",
          eta: eta.toISOString(),
        })
      );

      // Send the "out_for_delivery" message 2 seconds later
      setTimeout(function () {
        ws.send(
          JSON.stringify({
            orderId,
            messageType: "status_update",
            status: "out_for_delivery",
            eta: eta.toISOString(),
          })
        );

        // Send the "delivered" message 3 seconds later
        setTimeout(function () {
          ws.send(
            JSON.stringify({
              orderId,
              messageType: "status_update",
              status: "delivered",
              eta: eta.toISOString(),
            })
          );

          ws.send(
            JSON.stringify({
              messageType: "close_connection",
              message: "Order was delivered successfully.",
            })
          );

          ws.close();
        }, 3000);
      }, 2000);
    }, 5000);
  }, 4000);
};
