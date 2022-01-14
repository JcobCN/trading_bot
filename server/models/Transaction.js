module.exports = function(sequelize, Sequelize) {
    var Transaction = sequelize.define("Transaction", {
        timestamp: Sequelize.TIME,          // The timestamp that the transaction occured.
        amount: Sequelize.STRING,            // Bought / Sold / Transafered amount.
        from: Sequelize.STRING,             // From  Wallet Address
        to: Sequelize.STRING,               // To Wallet Address
        transaction: Sequelize.STRING       // Transactin Hash value.
    },{
        timestamps: false
    });
    Transaction.associate = function(models) {
        // associations can be defined here
      };
    return Transaction;
}