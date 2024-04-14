const Authority = require('../models/autority');
const generateRandomUID = require('../utils/utilities')


exports.CreateAuthority = async (req, res) => {
    const { label} = req.body;
    const uid=generateRandomUID('I')
    try {
        let errors = [];
        let existingAuthority = await Authority.findOne({ label });

        if (existingAuthority) {
            errors.push('Label already exists');
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors });
          }
        const newAuthority = new Authority({
            uid ,
            label
        });
        await newAuthority.save();
        res.status(201).json({newAuthority});  
    
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  };
exports.UpdateAuthority=async (req, res) => {
    const uidAuthority = req.params.uid;
    const { label} = req.body;
    try {
    let errors = [];
   let authority = await Authority.findOne({ uid: uidAuthority });
   if (!authority) {
    errors.push('Authority not found');
   }
   const existingAuthorityWithLabel = await Authority.findOne({ label: label });
    if (existingAuthorityWithLabel && existingAuthorityWithLabel.uid !== uidAuthority) {
      errors.push('Label already exists for another authority');
    }

   if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
   let updatedAuthority = await Authority.findOneAndUpdate({ uid: uidAuthority},
    { $set: { label } },
    { new: true },);

    res.status(200).json({updatedAuthority});

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })   
    }

};

exports.GetAuthority = async (req, res) => {
    const uidAuthority = req.params.uid;
    try {
        let errors = [];

        const authority = await Authority.findOne({ uid: uidAuthority });

        if (!authority) {
            errors.push( 'Authority not found');
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors });
          }
        res.status(200).json(authority);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}