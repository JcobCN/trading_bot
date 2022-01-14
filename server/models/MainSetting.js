module.exports = function(sequelize, Sequelize) {
    var MainSetting = sequelize.define("MainSetting", {
        mainWalletAddress: Sequelize.STRING,    // The Hash Address of Main Wallet.
        mainWalletPrivateKey: Sequelize.STRING, // The private Key for main wallet.

        tokenAddress: Sequelize.STRING,         // Token's address in the network.
        tokenName: Sequelize.STRING,            // Token's name in the network.
        tokenSymbol: Sequelize.STRING,          // Token's Symbol.
    },{
        timestamps: false
    });
    MainSetting.associate = function(models) {
        // associations can be defined here
      };
    return MainSetting;
}   