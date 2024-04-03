import mongoose from 'mongoose'

const connection = process.env.MONGO_URL || 'http:localhost'

export const connectDB = async () => {
    try {
        await mongoose.connect(connection)
        console.log('DB succesfully connected')
    } catch (e) {
        console.log(e.message)
    }
}