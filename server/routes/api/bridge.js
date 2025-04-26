const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const {
  abi
} = require('../../../resource/SmartContract/artifacts/contracts/BrigeToken.sol/BridgeToken.json');
const { check, validationResult } = require('express-validator');
const { Hardhat, ContractAddress } = require('../../config/constant');

const Burn = require('../../models/Burn');

const provider = new ethers.JsonRpcProvider(Hardhat);
const bridgeToken = new ethers.Contract(ContractAddress, abi, provider);

// @route    POST api/bridge/burn
// @desc     Burn tokens
// @access   Public
router.post(
  '/burn',
  [
    check('tokenAddress', 'Token address is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('sender', 'Sender address is required').not().isEmpty(),
    check('privateKey', 'Private key is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tokenAddress, amount, sender, privateKey } = req.body;

    try {
      const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'address'],
        [tokenAddress, amount, sender]
      );
      const wallet = new ethers.Wallet(privateKey, provider);
      const signature = await wallet.signMessage(ethers.getBytes(messageHash));
      const contractWithSigner = bridgeToken.connect(wallet);

      const tx = await contractWithSigner.burn(
        tokenAddress,
        amount,
        signature,
        messageHash
      );
      const receipt = await tx.wait();

      console.log('Transaction receipt success', receipt.hash);

      const newBurn = new Burn(receipt);
      const burn = await newBurn.save();

      console.log('Transaction saved success', burn._id);

      res.json({ success: true, receipt });
    } catch (error) {
      console.error('Error in burn:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// @route    POST api/bridge/mint
// @desc     Mint tokens
// @access   Public
router.post(
  '/mint',
  [
    check('tokenAddress', 'Token address is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('sender', 'Sender address is required').not().isEmpty(),
    check('privateKey', 'Private key is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tokenAddress, amount, sender, privateKey } = req.body;

    try {
      const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'address'],
        [tokenAddress, amount, sender]
      );
      const wallet = new ethers.Wallet(privateKey, provider);
      const signature = await wallet.signMessage(ethers.getBytes(messageHash));
      const contractWithSigner = bridgeToken.connect(wallet);

      const tx = await contractWithSigner.mint(
        tokenAddress,
        amount,
        signature,
        messageHash
      );
      const receipt = await tx.wait();

      res.json({ success: true, receipt });
    } catch (error) {
      console.error('Error in mint:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// @route    GET api/bridge/burns
// @desc     Get all burns
// @access   Public
router.get('/burns', async (req, res) => {
  try {
    const burns = await Burn.find();
    res.json(burns);
  } catch (error) {
    console.error('Error fetching burns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route    GET api/bridge/burns/:id
// @desc     Get burn by ID
// @access   Public
router.get('/burns/:id', async (req, res) => {
  try {
    const burn = await Burn.findById(req.params.id);
    if (!burn) {
      return res.status(404).json({ msg: 'Burn not found' });
    }
    res.json(burn);
  } catch (error) {
    console.error('Error fetching burn:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
