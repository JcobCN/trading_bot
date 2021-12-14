const { Front, FrontDetail } = require("../models");
const app = require("../app.js");

/** @module settingController */

/** 
 * <pre>
 * APIs for Settings 
 * API prefix : /setting/
 * Provided APIs : resetFront
 *                 initFront
 *                 resetAll
 * </pre>
 */

/**
 * @function sendUpdateMessage
 * @description Send update message to each client in order to apply updated settings.
 */
function sendUpdateMessage() {
  var aWss = app.wss.getWss("/");
  aWss.clients.forEach(function(client) {
    client.send("setting Updated");
  });
}

/**
 * @export @function API: /setting/resetFront
 * @description Reset Front settings. 
 * @description The function destroyes the front settings data from database, and apply.
 * @return : "Front Information has been deleted" on success
 * @return : Error message on error.
 */
 function resetFront(req, res) {

  // Front has only 1 instance in the database.
  Front.destroy({
    where: {
      id: 1,
    },
  })
    .then((status) =>
      res.status(201).json({
        error: false,
        message: "Front Information has been deleted",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
  sendUpdateMessage();
}

/**
 * 
 * @export @function API: /setting/initFront
 * @description Initialize the Front data. 
 * @description The function clears Front running Transaction History data from database and update.
 * @return : "Front running Transaction History has been deleted" on success
 * @return : Error message on error.
 */
function initFront(req, res) {
  // Remove all of the Front running Transaction History data from database.  
  FrontDetail.destroy({
    where: {},
    truncate: true,
  })
    .then((status) =>
      res.status(201).json({
        error: false,
        message: "Front running Transaction History has been deleted",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
  sendUpdateMessage();
}

/**
 * 
 * @export @function API: /setting/resetAll
 * @description Initialize all of the settings 
 * @description The function clears all of the settings from database including : .
 * @description Front, FrontDetail ... 
 * @return :"All Information has been deleted" on success
 * @return : Error message on error.
 */
function resetAll(req, res) {
  // We should handle the result if success or fail for each destroy option.
  promise1 = Front.destroy({
    where: {
      id: 1,
    },
  });
  
  promise2 = FrontDetail.destroy({
    where: {},
    truncate: true,
  })
  
  Promise.all([promise1, promise2]).then((status_list) =>
      res.status(201).json({
        error: false,
        message: "All Information has been deleted",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
  sendUpdateMessage();
}

module.exports = {
  initFront,
  resetFront,
  resetAll,
};
