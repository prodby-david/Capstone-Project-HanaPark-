import Reservation from '../../models/reservation.js';
import QRCode from 'qrcode';


const GetUserHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        if(!userId){
            res.status(401).json({message: 'Unauthorized access. Please sign in.'});
        }

        const pendingReservation = await Reservation.find({reservedBy: userId, status: 'Pending'}).populate('slotId', 'slotCode slotType slotPrice').sort({ createdAt: -1 });

        const activeReservation = await Reservation.find({reservedBy: userId, status: 'Reserved'}).populate('slotId', 'slotCode slotType slotPrice').sort({ createdAt: -1 });

        const cancelledReservation = await Reservation.find({reservedBy: userId, status: 'Cancelled'}).populate('slotId').sort({ createdAt: -1 });

        const completeReservation = await Reservation.find({reservedBy: userId, status: 'Completed'}).populate('slotId', 'slotCode slotType slotPrice').sort({ createdAt: -1 });

        const latest = pendingReservation[pendingReservation.length - 1] || activeReservation[activeReservation.length - 1];

        let latestWithQr = null;
            if (latest) {
            const qrCodeDataURL = await QRCode.toDataURL(latest.verificationCode);
            latestWithQr = {
                ...latest.toObject(),
                reservationCode: latest.verificationCode,
                qrCode: qrCodeDataURL,
            };
        }

        res.status(200).json({message: 'User history retrieved successfully', activeReservation, pendingReservation, completeReservation, cancelledReservation, latestReservation: latestWithQr,});

    } catch (err) {
        return res.status(500).json({ message: 'Server error. Please try again later.', err });
    }
}

export default GetUserHistory;