module.exports = function(sequelize, Sequalize) {
    var Wallet = sequelize.define("Wallet", {
        walletAddress: Sequalize.STRING,
        walletPrivateKey: Sequalize.STRING,
        status: Sequalize.STRING,
    },{
        timestamps: false
    });
    Wallet.associate = function(models) {
        // associations can be defined here
      };
    return Wallet;
}