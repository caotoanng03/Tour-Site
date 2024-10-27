import sequelize from "../config/database";
import cron from "node-cron"
import { DataTypes, Op } from "sequelize";

const ForgotPassword = sequelize.define('forgot_password', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    expireAt: {
        type: DataTypes.DATE
    }
}, { tableName: 'forgot_password', timestamps: false });

// Scheduler to delete expired record at midnight everyday
cron.schedule('0 0 * * *', async () => {
    try {
        const deletedCount = await ForgotPassword.destroy({
            where: {
                expireAt: { [Op.lt]: new Date() }
            }
        });
        if (deletedCount > 0) {
            console.log(`Deleted ${deletedCount} expired password reset records.`);
        }
    } catch (error) {
        console.error('Error deleting expired records:', error);
    }
});

export default ForgotPassword;