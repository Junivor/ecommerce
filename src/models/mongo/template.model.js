import TemplateRepository from "../repositories/template/template.repository.js";
import {Schema} from "mongoose";
import Databases from "../../dbs/init.databases.js";

const client = Databases.getClientFromMongo("shop")

const templateSchema = new Schema({
    template_name: {
        type: String,
        required: true,
        unique: true,
    },
    template_type: {
        type: String,
        enum: ["verification", "promotion", "welcome"],
        default: "verification"
    },
    template_status: {
        type: String,
        default: 'active'
    },
    template_html: {
        type: String,
        required: true,
        default: ""
    }
}, {
    collection: "Templates",
    timestamps: true,
})


templateSchema.loadClass(TemplateRepository)

client.model("Template", templateSchema)
