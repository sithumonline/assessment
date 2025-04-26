const mongoose = require('mongoose');
const { Schema } = mongoose;

const BurnSchema = new Schema({
    blockHash: {
        type: String,
        required: true
    },
    blockNumber: {
        type: Number,
        required: true
    },
    contractAddress: {
        type: String,
        required: false,
    },
    cumulativeGasUsed: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    gasPrice: {
        type: String,
        required: true
    },
    blobGasUsed: {
        type: String,
        required: false
    },
    blobGasPrice: {
        type: String,
        required: false
    },
    gasUsed: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    logsBloom: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
    
module.exports = mongoose.model('Burn', BurnSchema);
