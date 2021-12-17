module.exports = function(sequelize, Sequalize) {
    var Transaction = sequelize.define("Transaction", {
        timestamp: Sequalize.STRING,
        action: Sequalize.STRING,           // buy / sell
        amount: Sequalize.STRING,
        address: Sequalize.STRING,          // Working Wallet Address
        transaction: Sequalize.STRING       // Transactin Hash value.
    },{
        timestamps: false
    });
    Transaction.associate = function(models) {
        // associations can be defined here
      };
    return Transaction;
}