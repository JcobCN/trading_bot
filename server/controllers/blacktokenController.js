const { BlackToken } = require("../models");

/** @module blacktokenController*/
/**
 * <pre>
 * APIs for handling black tokens
 * API prefix : /tokens/blacklist/
 * Provided APIs : list
 *                 add
 *                 delete
 * </pre>
 */

module.exports = {

/**
 * @export @function API : /tokens/blacklist/list
 * @description Get the list of black tokens.
 * @return  Black Token List (name, symbol, address, actions)
 * @return  Error message on fail.
 */
  list(req, res) {
    // Retrieve all blacktokens from database and return the result
    BlackToken.findAll({})
      .then((tokens) =>
        res.status(201).json({
          error: false,
          data: tokens,
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          message: error,
        })
      );
  },

/**
 * @export @function API : /tokens/blacklist/add
 * @description Add token information to the blacklist
 * @param {string} name - The name of the token
 * @param {string} symbol - The symbol of the token
 * @param {string} address - The address of the token
 */
  add(req, res) {
    const { name, symbol, address } = req.body;
    
    // Create blacktoken object and insert into database
    BlackToken.create({
      name: name,
      symbol: symbol,
      address: address,
    });
  },

/**
 * @export @function API : /tokens/blacklist/delete
 * @description   Delete the token of given address from the blacklist
 * @param {string} address - The token address to delete
 * @return "Deleted" message on success.
 * @return Error message on fail.
*/  
  delete(req, res) {
      
    const { address } = req.body;

    console.log(req.body)

    // delete given token from database
    BlackToken.destroy({
      where: {
        address: address,
      },
    })
      .then((status) =>
        res.status(201).json({
          error: false,
          message: "token has been deleted",
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },
};
