module.exports = function(sequelize, Sequalize) {
    var MainSetting = sequelize.define("MainSetting", {
        mainWalletAddress: Sequalize.STRING,    // The Hash Address of Main Wallet.
        mainWalletPrivateKey: Sequalize.STRING, // The private Key for main wallet.
        tokenAddress: Sequalize.STRING,         // Token's address in the network.
        tokenName: Sequalize.STRING,            // Token's name in the network.
        tokenSymbol: Sequalize.STRING,          // Token's Symbol.
    },{
        timestamps: false
    });
    MainSetting.associate = function(models) {
        // associations can be defined here
      };
    return MainSetting;
}   