const { Token } = require("../models");

/** @module tokenController */

/**
 * <pre>
 * APIs for handling tokens
 * API prefix : /tokens/
 * Provided APIs : list
 *                 add
 *                 delete
 * </pre>
 */

module.exports = {

/**
 * 
 * 
 * @export @function API : /tokens/list
 * @description Get the list of tokens.
 * @return  Token list(name, symbol, address, actions)
 * @return  Error message on fail.
 */
  list(req, res) {

    // Get all of the registered tokens from database
    Token.findAll({})
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
 * 
 * 
 * @export @function API: /tokens/add
 * @description Add token information to the token list
 * @param {string} name - The name of the token
 * @param {string} symbol - The symbol of the token
 * @param {string} address - The address of the token
 */
  add(req, res) {
    const { name, symbol, address } = req.body;
    // Create token object with given information to put into database. 
    Token.create({
      name: name,
      symbol: symbol,
      address: address,
    });
  },

/**
 * @export @function API : /tokens/delete
 * @description Delete the token of given address from the token list
 * @param {string} address - The token address to delete
 * @return "token has been deleted" on success.
 * @return Error message on fail.
*/
  delete(req, res) {
      
    const { address } = req.body;

    console.log(req.body)

    // Find the token with given address and remove from database
    Token.destroy({
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
