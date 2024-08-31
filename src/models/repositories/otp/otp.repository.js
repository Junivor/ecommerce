import OTP from "../../mysql/otp.model.js";

export default class OTPRepository extends OTP {
    static createOTP({ otp_token, otp_email }) {
        return this.create({
            otp_token,
            otp_email,
        })
    }
    static findOTP({ otp_token }) {
        return this.findOne({
            where: {otp_token}
        })
    }
    static deleteOTP({ otp_token }) {
        return this.destroy({
            where: {otp_token}
        })
    }
}