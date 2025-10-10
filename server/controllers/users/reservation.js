import Reservation from "../../models/reservation.js"
import Slot from '../../models/slot.js'
import User from "../../models/user.js";
import crypto from 'crypto'
import QRCode from 'qrcode';
import { normalizeVehicleType } from "../../utils/vehicleTypes.js";


const CreateReservation = async(req,res) => {

    try{
        const { slotId } = req.params;
        const { slotCode, slotPrice, reservationDate, reservationTime, arrivalTime, plateNumber, vehicleType } = req.body;
        const userId = req.user?.userId;
        
            if(!userId){
                res.status(401).json({message: 'Unauthorized access. Please log in.'});
                return;
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ message: 'User does not exist.' });
            }

            if(!slotId){
                res.status(400).json({ message: 'Slot ID is required' });
                return;
            }

            if(!slotCode || !slotPrice || !reservationDate || !arrivalTime || !reservationTime || !plateNumber || !vehicleType){
                return res.status(400).json({ message: 'All fields are required' });
            }

            const slot = await Slot.findById(slotId);

            if (!slot) {
                return res.status(404).json({ message: 'Slot not found.' });
            }

            const existingReservation = await Reservation.findOne({slotId, status: 'Pending'});

            if(existingReservation){
                return res.status(409).json({message: 'Slot is already reserved.'});  
            }

            const plateInUse = await Reservation.findOne({ plateNumber, status: 'Pending' });

            if (plateInUse) {
                return res.status(409).json({ message: 'The registered vehicle in your account already has a reservation.' });
            }

            const userHasReservation = await Reservation.findOne({ reservedBy: userId, status: 'Pending' });
            
            if (userHasReservation) {
                return res.status(409).json({ message: 'Your account already have an active reservation.' });
            }

            const userVehicleType = normalizeVehicleType(user.vehicle?.vehicleType || vehicleType);
            const slotVehicleType = normalizeVehicleType(slot.slotType);

            if (!userVehicleType || !slotVehicleType) {
            return res.status(400).json({ message: 'Vehicle and Slot Type must be same.' });
            }

            if (userVehicleType !== slotVehicleType) {
            return res.status(400).json({
                message: `This slot is only for ${slotVehicleType} vehicles.`,
            });
            }

            const verificationCode = crypto.randomBytes(8).toString('hex').toLowerCase();
            const qrCodeDataURL = await QRCode.toDataURL(verificationCode);
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

            const userReservation = new Reservation({ reservedBy: userId, verificationCode, slotId, slotCode, qrCode: qrCodeDataURL,  slotPrice,reservationDate, reservationTime, arrivalTime, plateNumber, vehicleType, status: 'Pending', isEntryUsed: false, isExitUsed: false, expiresAt });

            await userReservation.save();
            
            const updatedSlot = await Slot.findByIdAndUpdate(
                slotId,
                { slotStatus: 'Reserved' },
                { new: true }
            );

            const populatedReservation = await Reservation.findById(userReservation._id)
            .populate('reservedBy', 'firstname lastname userType studentId staffId')
            .populate('slotId', 'slotType slotCode');

            req.io.emit('slotUpdated', updatedSlot);
            req.io.to("admins").emit("reservationCreated", populatedReservation);
            console.log("✅ Sent reservationCreated to admins:", populatedReservation._id);
            
            res.status(201).json({message: 'Reservation created successfully.', 
                success: true, 
                reservationCode: verificationCode,
                qrCode: qrCodeDataURL
             });

    }catch(err){
        res.status(500).json({ message: 'An unexpected error occured. Please try again later.', err });
    }

};

export default CreateReservation;