module.exports = function(sequelize, Sequalize) {
    var Transaction = sequelize.define("Transaction", {
        timestamp: Sequalize.TIME,          // The timestamp that the transaction occured.
        action: Sequalize.STRING,           // buy / sell / gather / distribute
        amount: Sequalize.FLOAT,            // Bought / Sold / Transafered amount.
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