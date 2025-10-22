import React, { useState } from "react";
import Header from "../../components/headers/header";
import {
  InformationCircleIcon,
  UserGroupIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  BookmarkSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {publicApi} from '../../lib/api';
import CustomPopup from "../../components/popups/popup";
import Loader from "../../components/loaders/loader";



const FAQ = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name:'',
    email: '',
    subject: '',
    message: ''
  });
  const [popup, setPopup] = useState({
      show: false,
      type: "info",
      title: "",
      message: "",
      onConfirm: null,
  });
  const faqs = [
    {
      icon: <InformationCircleIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "What is HanaPark?",
      answer:
        "HanaPark is a smart parking web application exclusively for STI College Global City. It allows students and staff to find, reserve, and manage parking slots in real time.",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "Who can use HanaPark?",
      answer:
        "HanaPark is available only to registered students and staff of STI College Global City. Each user must have an active STI account to log in and access the platform.",
    },
    {
      icon: <ClockIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "Can I view my reservation history?",
      answer:
        "Yes. You can view all your past and current reservations, including their status in your Recent Activities tab.",
    },
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "Can I access HanaPark on my phone?",
      answer:
        "Yes, HanaPark is mobile-friendly and can be accessed through any modern web browser on your smartphone.",
    },
    {
      icon: <ExclamationTriangleIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "What happens if I cancel after my reservation is approved?",
      answer:
        "Cancelling after admin confirmation will automatically mark your account with a violation tag. Repeated violations may lead to temporary suspension from the system.",
    },
    {
      icon: <KeyIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "What if I forget my password?",
      answer:
        "You can use the Forgot Password option in the sign-in form to receive a reset link through your registered email.",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "Is my personal information safe in HanaPark?",
      answer:
        "Yes. HanaPark implements data protection practices to ensure your account details and reservation history remain confidential.",
    },
    {
      icon: <NoSymbolIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "How many violations before getting suspended?",
      answer:
        "Typically, three violations result in temporary suspension. However, this policy may vary based on administrative discretion.",
    },
    {
      icon: <BookmarkSquareIcon className="w-8 h-8 text-color-3 mb-3 mx-auto" />,
      question: "How do I reserve a parking slot?",
      answer:
        "Simply log in, view available slots in real-time, and click the Reserve button for your preferred slot. You’ll receive confirmation once it’s successfully reserved.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value})
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.name || !formData.email || !formData.subject || !formData.message){
         setPopup({
        show: true,
        type: "error",
        title: "Failed to send message",
        message: 'Fields must not be empty',
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
      return;
    }

    setLoading(true);

    try {

      const res = await publicApi.post('/message', formData)
      setFormData(res.data);
      setPopup({
      show: true,
      type: "success",
      title: "Message Sent!",
      message: "Thanks for reaching out — we’ll get back to you soon.",
      onConfirm: () => setPopup({ ...popup, show: false }),
    });

    setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong while sending your message. Please try again later.";

      setPopup({
        show: true,
        type: "error",
        title: "Failed to Send",
        message: errorMessage,
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
    } finally {
      setLoading(false);
    }
  }





  return (
    <>
      <Header />

      <div className="flex flex-col items-center my-12 px-6 lg:px-20 min-h-screen">
        <h2 className="font-bold text-3xl text-color mb-10 text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 text-center border border-gray-100"
            >
              {faq.icon}
              <h3 className="font-semibold text-color-3 text-lg mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="w-full max-w-4xl text-center bg-gradient-to-r from-color-3 to-[#6a5acd] text-white rounded-2xl shadow-lg p-10 mt-8">
          <ChatBubbleBottomCenterTextIcon className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-2xl font-semibold mb-3">
            Still have questions or ideas for HanaPark?
          </h3>
          <p className="text-sm sm:text-base mb-6">
            We're always looking to improve! If you have suggestions, encounter issues,
            or just need help, don’t hesitate to reach out.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-color-3 font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            Get in Touch
          </button>
        </div>

        <div className="mt-10 text-center text-gray-600">
          <LightBulbIcon className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
          <p className="text-sm">
            Have an idea to make HanaPark smarter? Let us know — innovation starts with you!
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-color-3"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center mb-5">
              <h3 className="text-2xl font-semibold text-color text-center">
                Reach Out to Us
              </h3>
              <p className="text-sm text-color-2">
                Questions or concerns? We’d love to hear from you.
              </p>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="border border-color-2 rounded-lg px-4 py-2 outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Active Gmail Address"
                className="border border-color-2 rounded-lg px-4 py-2 outline-none"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="border border-color-2 rounded-lg px-4 py-2 outline-none"
              />
              <textarea
                rows="3"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message..."
                maxLength={100}
                className="border border-color-2 rounded-lg px-4 py-2 outline-none resize-none text-sm text-color-2"
              ></textarea>

              <button
                type="submit"
                className="bg-color-3 text-sm text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {loading && <Loader text="Submitting your message..."/>}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
        onConfirm={popup.onConfirm}
      />
    </>
  );
};

export default FAQ;
