import Admin from '../../models/admin.js';



const AdminRegistrationController = async(req,res) => {

    try{
         const { adminusername, adminpassword } = req.body;

         const adminUser = await Admin.findOne({adminusername});

         if(adminUser){
            res.status(409).json({message: 'Admin username is used. Please try another.'});
            return;
         }

         const newAdmin = new Admin ({ adminusername , adminpassword });

         await newAdmin.save();

         res.status(201).json({message: 'Admin registration success.', success: true});

    }catch(err){
        res.status(500).json({message: 'Internal server error.'});
        return;
    }
}

export default AdminRegistrationController;