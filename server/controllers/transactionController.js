const { Transaction } = require("../models");
const app = require("../app.js");



/**
 * @export @function API: /transactions/front
 * @description 
 * <pre>
 *  List all of the front detail information.  
 * </pre>
 * @return : transaction list (timestamp, token, action, price, transaction, other)
 * @return : Error message on error.
 */
function listTransactions(req, res) {

    // Retrieve all of the front detail information from dataase.
    Transaction.findAll({})
        .then(transactions => res.status(201).json({
            error: false,
            data: transactions
        }))
        .catch(error => res.json({
            error: true,
            message: error
        }));
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
    })
        .then((status) =>
            res.status(201).json({
                error: false,
                message: "Transaction History has been deleted",
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
    listTransactions,
    clearHistory,
};
