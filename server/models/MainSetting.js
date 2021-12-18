module.exports = function(sequelize, Sequalize) {
    var MainSetting = sequelize.define("MainSetting", {
        mainWalletAddress: Sequalize.STRING,
        mainWalletPrivateKey: Sequalize.STRING,       // 
        tokenAddress: Sequalize.STRING,
        tokenName: Sequalize.STRING,            // Working Wallet Address
        tokenSymbol: Sequalize.STRING,
        botStatus: Sequalize.STRING,            // buy / sell / stop
    },{
        timestamps: false
    });
    MainSetting.associate = function(models) {
        // associations can be defined here
      };
    return MainSetting;
}   