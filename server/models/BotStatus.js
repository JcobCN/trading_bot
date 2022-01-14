module.exports = function(sequelize, Sequelize) {
    var BotStatus = sequelize.define("BotStatus", {
        timestamp: Sequelize.TIME,                // The timestamp that the transaction occured.
        totalWorkWalletCount: Sequelize.INTEGER,
        processedWorkWalletCount: Sequelize.INTEGER,
        lastWorkWalletIndex: Sequelize.INTEGER,
        transKind: Sequelize.STRING,               // buy / sell / distribute / gather / none
        botStatus: Sequelize.STRING,               // running / paused / stop
    },{
        timestamps: false
    });
    BotStatus.associate = function(models) {
        // associations can be defined here
      };
    return BotStatus;
}   