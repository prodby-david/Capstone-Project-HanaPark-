import React, {useState, useEffect} from 'react'
import AdminAPI from '../../lib/inteceptors/adminInterceptor';


const Inquiries = () => {

    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
    const fetchInquiries = async () => {
        const res = await AdminAPI.get('/admin/inquiries');
        setInquiries(res.data);
    };
    fetchInquiries();
    }, []);


  return (
    <>
    {inquiries.map((inq) => (
        <div key={inq._id} className="border p-3 rounded-lg bg-white shadow-sm">
            <p><strong>Name:</strong> {inq.name}</p>
            <p><strong>Email:</strong> {inq.email}</p>
            <p><strong>Subject:</strong> {inq.subject}</p>
            <p><strong>Message:</strong> {inq.message}</p>
            <button
            onClick={() => window.open(`mailto:${q.email}?subject=Re: ${q.subject}`, '_blank')}
            className="mt-2 bg-color text-white px-3 py-1 rounded-lg hover:opacity-90 text-sm"
            >
            Reply via Gmail
            </button>
        </div>
    ))}
    </>
  )
}

export default Inquiries
