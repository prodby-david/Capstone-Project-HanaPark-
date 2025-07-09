
const VerifyAdminController = async (req,res) => {

    try {
        const { password } = req.body;

        if(!password){
            res.status(400).json({message: 'Password field should not be empty.'});
            return;
        }

        if(password !== process.env.ADMIN_SECRET_KEY){
            res.status(401).json({message: 'You must enter the correct password.'});
            return;
        }

        return res.status(200).json({message: 'Password is correct. Please continue.', success: true});

    }
    catch(err){
        return res.status(500).json({message: 'Server error.'});
    }

}

export default VerifyAdminController;