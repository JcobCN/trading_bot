module.exports = function(sequelize, Sequalize) {
    var BotStatus = sequelize.define("MainSetting", {
        timestamp: Sequalize.TIME,                // The timestamp that the transaction occured.

        mainBnbAmount: Sequalize.FLOAT, 
        mainTokenAmount: Sequalize.FLOAT, 

        totalWalletCount: Sequalize.INTEGER,
        processedWalletCount: Sequalize.INTEGER,

        lastWalletIndex: Sequalize.INTEGER,
        botStatus: Sequalize.STRING,               // buy / sell / distribute / gather / stop

    },{
        timestamps: true
    });
    BotStatus.associate = function(models) {
        // associations can be defined here
      };
    return BotStatus;
}   