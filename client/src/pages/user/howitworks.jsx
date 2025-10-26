import React from "react";
import {
  UserIcon,
  MapPinIcon,
  QrCodeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "../../components/headers/header";
import UserFooter from "../../components/footers/userFooter";

const steps = [
  {
    icon: <UserIcon className="w-10 h-10 text-color" />,
    title: "Sign In or Continue as Visitor",
    description:
      "Start by signing in to your HanaPark account for a personalized experience. You can also continue as a visitor to explore parking availability before registering.",
  },
  {
    icon: <MapPinIcon className="w-10 h-10 text-color" />,
    title: "Find an Available Parking Slot",
    description:
      "View real-time parking availability. HanaPark lets you see which slots are open, occupied, or reserved so you can quickly find the best spot.",
  },
  {
    icon: <CalendarDaysIcon className="w-10 h-10 text-color" />,
    title: "Reserve Your Slot Instantly",
    description:
      "Select your preferred parking slot and confirm your reservation. A unique QR code will be generated for you to use upon arrival.",
  },
  {
    icon: <QrCodeIcon className="w-10 h-10 text-color" />,
    title: "Arrive and Scan Your QR Code",
    description:
      "Upon arrival, simply scan your QR code at the entrance. The system verifies your booking and grants seamless access to your designated slot.",
  },
  {
    icon: <CheckCircleIcon className="w-10 h-10 text-color" />,
    title: "Manage and Monitor Reservations",
    description:
      "Track your reservations, view details, or cancel anytime. Get instant updates on your parking status directly through the dashboard.",
  },
  {
    icon: <ChatBubbleLeftRightIcon className="w-10 h-10 text-color" />,
    title: "Rate and Share Feedback",
    description:
      "After parking, share your feedback or suggestions. Your insights help us improve HanaPark for a smoother experience.",
  },
];

const HowItWorks = () => {
  return (
    <>

        <Header />
    
        <section className="min-h-screen py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-color mb-3">
            How <span className="text-color-3">HanaPark</span> Works?
            </h1>
            <p className="text-color-2 max-w-2xl mx-auto text-sm mb-12">
            HanaPark simplifies parking through smart management, real-time
            tracking, and QR-based access. Here’s how it works step by step.
            </p>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
                <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 flex flex-col items-center text-center"
                >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold text-color mb-2">
                    {step.title}
                </h3>
                <p className="text-sm text-color-2 leading-relaxed">
                    {step.description}
                </p>
                </div>
            ))}
            </div>
        </div>
        </section>

        <UserFooter />
    </>
  );
};

export default HowItWorks;
