const { FrontDetail } = require('../models');

/** @module transactionController */

/** 
 * <pre>
 * APIs for transactions
 * API prefix : /transactions
 * Provided APIs :  front
 * </pre>
 */


module.exports = {

/**
 * @export @function API: /transactions/front
 * @description List all of the front detail information.  
 * @return : transaction list (timestamp, token, action, price, transaction, other)
 * @return : Error message on error.
 */
    front(req, res) {

        // Retrieve all of the front detail information from dataase.
        FrontDetail.findAll({})
        .then(transactions => res.status(201).json({
            error: false,
            data : transactions
        }))
        .catch(error => res.json({
            error: true,
            message: error
        }));
    },
}