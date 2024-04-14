const DAAQ = require('../models/daaq')
const generateRandomUID = require('../utils/utilities')

exports.CreateDAAQ = async (req, res) => {
  const { label, readDAAQ, updateDAAQ } = req.body
  const uid = generateRandomUID('I')
  try {
    const newDaaq = new DAAQ({
      uid,
      label,
      readDAAQ,
      updateDAAQ,
    })
    await newDaaq.save()
    res.status(201).json({ newDaaq })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

exports.UpdateDAAQ = async (req, res) => {
  const uidDaaq = req.params.uid
  const { label, readDAAQ, updateDAAQ } = req.body
  try {
    let errors = [];
    let daaq = await DAAQ.findOne({ uid: uidDaaq })
    if (!daaq) {
      errors.push('Daaq not found')
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }
    let updatedDaaq = await DAAQ.findOneAndUpdate(
      { uid: uidDaaq },
      { $set: { label, readDAAQ, updateDAAQ } },
      { new: true },
    )

    res.status(200).json({ updatedDaaq })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
};

exports.GetDAAQ = async (req, res) => {
  const uidDaaq = req.params.uid
  try {
    let errors = []
    const daaq = await DAAQ.findOne({ uid: uidDaaq })
    if (!daaq) {
      errors.push('Daaq not found')
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }
    res.status(200).json({ daaq })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
