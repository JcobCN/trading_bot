module.exports = function(sequelize, Sequalize) {
    var Front = sequelize.define("Front", {
        status: Sequalize.STRING,
        node: Sequalize.STRING,
        network: Sequalize.STRING,
        wallet: Sequalize.STRING,
        key: Sequalize.STRING,
        safetyWallet: Sequalize.STRING,
        token: Sequalize.STRING,
        slippage: Sequalize.STRING,
        minbnb: Sequalize.STRING,
        maxbnb: Sequalize.STRING,
        gasSetting: Sequalize.STRING,
    },{
        timestamps: false
    });
    Front.associate = function(models) {
        // associations can be defined here
      };
    return Front;
}