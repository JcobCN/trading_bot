const { Front } = require("../models");
const fController = require("./botController");

/** @module botController*/
/**
 * <pre>
 * APIs for handling basic bot activity 
 * API prefix : /bots/
 * Provided APIs : startFront
 *                 stopFront
 *                 getFrontStatus
 * 
 * </pre>
 */
 
module.exports = {

  /* front running ... */
/**
 * @export @function API : /bots/startBot
 * 
 * @description 
 * <pre>
 * Main API method to start bot operation. 
 * Actions : 
 *         call scanMempool to scan memory pool for given information.
 *         Set the front running status as 1.
 *         save to Front Database for given information.
 * </pre>
 * 
 * @return  front data (status, node, network, wallet, key, safetyWallet, token, slippage,  minbnb, maxbnb, gasSetting) 
 * @return  Error message on fail.
 */    
  startBot(req, res) {
    const {
      node, network,
      wallet, key,
      safetyWallet,
      slippage,
      minbnb, maxbnb,
      gasSetting
    } = req.body;

    // Call scan Memory Pool.
    try {
      fController.scanMempool(
        node, network, 
        wallet, key,
        safetyWallet,
        slippage,
        minbnb, maxbnb,
        gasSetting
      );
    } catch (err) {
      console.log("Front scan mempool error......");
    }

    /* save database */

    const status = "1";
    Front.update(
      {
        status: status,
        node: node,
        network: network,
        wallet: wallet,
        key: key,
        safetyWallet: safetyWallet,
        slippage: slippage,
        minbnb: minbnb,
        maxbnb: maxbnb,
        gasSetting:gasSetting
      },
      {
        where: {
          id: 1,
        },
      }
    )
      .then((front) =>
        res.status(201).json({
          error: false,
          data: front,
          message: "setting has been updated in the front running",
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },

/**
 * @export @function API : /bots/stopBot
 * 
 * @description 
 * <pre>
 * Stop Front action.
 * Actions : 
 *     unsubcribe from the Web3 Front subscription, if there was active one.
 *     Update the Front status to 0, which is NOT RUNNING
 * </pre>
 * 
* @return  Front data (status, node, wallet, key, token, amount, slippage, gasSetting) 
 * @return  Error message on fail.
 */
  stopBot(req, res) {
    // Unsubscribe from the Front subscription
    if (frontSubscription != null) {
      frontSubscription.unsubscribe(function(error, success) {
        if (success) console.log("Successfully unsubscribed!");
      });
    }

    // Update the status flag as 0 (STOPPED)
    Front.update(
      {
        status: "0",
      },
      {
        where: {
          id: 1,
        },
      }
    )
      .then((fdata) =>
        res.status(201).json({
          error: false,
          data: fdata,
          message: "setting has been updated in the front running",
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },

  /**
 * @export @function API : /bots/getBotStatus
 * 
 * @description 
 * <pre>
 * Get the Front status. - Retrieve the Front object from database and return it. <br>
 * If there is no front object(empty), create new one, and return it. In this case, the status is 0,
 * </pre>
 * @return  Front status (1 or 0)
 * @return  Error message on fail.
 */
  getBotStatus(req, res) {

    Front.findAll({
      attribute: "status",
      where: {
        id: 1,
      },
    })
      .then((front) => {
        if (front.length == 0) {
          console.log("-------------front status", front, front.length);

          let item = {
            id: 1,
            status: 0,
            node: "",
            network: "",
            wallet: "",
            key: "",
            safetyWallet: "",
            slippage: "",
            minbnb: "",
            maxbnb: "",
            gasSetting:"native"
          };

          // Create new front with status 0.
          Front.create(item).then((data) => {
            Front.findAll({
              attribute: "status",
              where: {
                id: 1,
              },
            }).then((data) =>
              res.status(201).json({
                error: false,
                data: data,
                message: "setting has been updated in the Front",
              })
            );
          });
        } else {
          res.status(201).json({
            error: false,
            data: front,
            message: "setting has been updated in the Front",
          });
        }
      })
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },
};
