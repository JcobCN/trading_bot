module.exports = function(sequelize, Sequalize) {
    var Wallet = sequelize.define("Wallet", {
        timestamp: Sequalize.TIME,              // The timestamp that wallet state updated.
        walletAddress: Sequalize.STRING,        // Hash Address for the wallet.
        walletPrivateKey: Sequalize.STRING,     // The private Key for main wallet.
        walletBnb: Sequalize.STRING,            // Bnb Amount in the wallet.
        walletToken: Sequalize.STRING,          // Token Amount in the wallet.
        status: Sequalize.STRING,               // Last status of the wallet.
    },{
        timestamps: false
    });
    Wallet.associate = function(models) {
        // associations can be defined here
      };
    return Wallet;
}