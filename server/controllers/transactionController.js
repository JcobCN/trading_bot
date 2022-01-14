const app = require ("../app.js");
const { Transaction } = require ("../models");
const { apiSuccess, apiError}  = require ("./engine");

/**
 * @module transactionController
 *  * <pre>
 * APIs for handling Transactons 
 * API prefix : /transactions/
 * Provided APIs : 
 *    listTransactions,
 *    clearHistory,
 * 
 * </pre>
 */

/**
 * @export @function API: listTransactions
 * @description 
 * <pre>
 *  List all of the front detail information.  
 * </pre>
 * @return : transaction list (timestamp, token, action, price, transaction, other)
 * @return : Error message on error.
 */
function listTransactions(req, res) {
  const {
    date, 
  } = req.body;

  let whereCondition = {};
  if( date != null ) {
    const startDate = Date.parse(date);
    const endDate = Date.parse(date);
    whereCondition = {
      timestamp : {
        $between: [startDate, endDate]
      }
    };
  }
  
  // Retrieve all of the front detail information from dataase.
  Transaction.findAll(
    { where : whereCondition }
  ) .then(transactions => apiSuccess(res, transactions, "Got the transactions")
  ) .catch(error => apiError(res, error, "Can't get the transaction list")
  );
}

/**
 * @export @function API: /transactions/clearHistory
 * @description 
 * <pre>
 *  Reset the transaction history
 * </pre>
 * @param {*} req 
 * @param {*} res 
 */
function clearHistory(req, res) {
  // Remove all of the Front running Transaction History data from database.  
  Transaction.destroy({
    where: {},
    truncate: true,
  }) .then((status) => apiSuccess(res, {}, "Transaction History has been deleted")
  ) .catch((error) => apiError (res, error, "Failed in deleting Transaction History")
  );
}

module.exports = {
  listTransactions,
  clearHistory,
};
