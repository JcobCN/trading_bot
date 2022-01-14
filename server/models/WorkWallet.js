module.exports = function(sequelize, Sequelize) {
  var WorkWallet = sequelize.define("WorkWallet", {
    timestamp: Sequelize.TIME,          // The timestamp that wallet state updated.
    walletAddress: Sequelize.STRING,    // Hash Address for the wallet.
    // walletPrivateKey: Sequelize.STRING, // Wallet's Private Key
    walletPrivateKey: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    // walletBnb: Sequelize.FLOAT,         // Bnb Amount in the wallet.
    // walletToken: Sequelize.FLOAT,       // Token Amount in the wallet.
    status: Sequelize.STRING,           // Last status of the wallet.
  },{
    timestamps: false
  });
  WorkWallet.associate = function(models) {
    // associations can be defined here
    };
  return WorkWallet;
}