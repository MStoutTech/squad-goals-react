const User = require("../models/User")

module.exports ={
    addTag: async (req, res) => {
    try{
        if (req.user.tags.includes(req.body.tag.toLowerCase())){
            res.status(409).json({message: "Tag already exists"});
        }else{
            await User.findByIdAndUpdate(req.user.id, {$addToSet: { tags: req.body.tag.toLowerCase() } });
            res.status(200).json({message: "New Tags Saved!"});
        }
        
    }catch (err) {
        console.log(err);
    }
    
    }


}