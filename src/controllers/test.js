import MODEL_MONGO from "../models/mongoTest.js";


export default async function testController() {
    return await MODEL_MONGO.find({}).lean().exec()
}