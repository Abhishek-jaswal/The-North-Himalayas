"use client";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    return (
        <div style={{
            minHeight: "100vh",

            fontFamily: "'Georgia', serif",
            position: "relative",
            overflow: "hidden",
        }}>

            {/* Mountain silhouette background */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.08, pointerEvents: "none" }}>
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "320px" }}>
                    <path fill="#ffffff" d="M0,320 L0,200 L120,120 L240,180 L360,60 L480,140 L600,20 L720,100 L840,40 L960,130 L1080,70 L1200,150 L1320,90 L1440,160 L1440,320 Z" />
                    <path fill="#ffffff" opacity="0.5" d="M0,320 L0,260 L180,180 L300,230 L420,160 L540,210 L660,130 L780,200 L900,150 L1020,220 L1140,170 L1260,240 L1380,190 L1440,220 L1440,320 Z" />
                </svg>
            </div>



            {/* Header bar */}
            <div style={{
                position: "relative",
                zIndex: 10,
                padding: "24px 40px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backdropFilter: "blur(8px)",
                background: "rgba(255,255,255,0.03)",
            }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "white",
                        padding: "8px 18px",
                        borderRadius: "50px",
                        cursor: "pointer",
                        fontSize: "14px",
                        letterSpacing: "0.5px",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                >
                    ← Back
                </button>
            </div>

            {/* Main content */}
            <main style={{
                position: "relative",
                zIndex: 10,
                maxWidth: "780px",
                margin: "0 auto",
                padding: "60px 40px 100px",
            }}>

                {/* Hero title block */}
                <div style={{ marginBottom: "56px", textAlign: "center" }}>
                    <p style={{
                        color: "#7eb8d4",
                        fontSize: "12px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        marginBottom: "16px",
                        fontFamily: "'Arial', sans-serif",
                    }}>
                        Legal Document
                    </p>
                    <h1 style={{
                        fontSize: "clamp(36px, 5vw, 54px)",
                        fontWeight: "700",
                        color: "white",
                        margin: "0 0 16px",
                        lineHeight: 1.15,
                        letterSpacing: "-0.5px",
                    }}>
                        Privacy Policy
                    </h1>
                    <div style={{ width: "60px", height: "2px", background: "linear-gradient(90deg, #7eb8d4, #4a9abe)", margin: "0 auto 20px" }} />
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", fontFamily: "'Arial', sans-serif", maxWidth: "500px", margin: "0 auto" }}>
                        Last updated: May 2025
                    </p>
                </div>

                {/* Intro card */}
                <div style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "16px",
                    padding: "28px 32px",
                    marginBottom: "40px",
                    backdropFilter: "blur(12px)",
                }}>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", lineHeight: "1.8", margin: 0, fontFamily: "'Georgia', serif" }}>
                        Welcome to <strong style={{ color: "white" }}>The North Himalayas</strong>. We value your privacy and
                        are committed to protecting your personal information throughout your
                        journey with us — from first inquiry to the mountaintop.
                    </p>
                </div>

                {/* Sections */}
                {[
                    {
                        icon: "📋",
                        title: "Information We Collect",
                        intro: "We may collect the following information when you contact us or book a tour:",
                        items: ["Full Name", "Phone Number", "Email Address", "Travel preferences & interests"],
                    },
                    {
                        icon: "🎯",
                        title: "How We Use Your Information",
                        intro: "Your information is used only for:",
                        items: ["Tour bookings & confirmations", "Customer support & assistance", "Travel updates & itinerary changes", "Providing customized travel packages"],
                    },
                ].map((section, idx) => (
                    <div key={idx} style={{
                        marginBottom: "32px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "28px 32px",
                        backdropFilter: "blur(8px)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                            <span style={{ fontSize: "20px" }}>{section.icon}</span>
                            <h2 style={{
                                color: "white",
                                fontSize: "20px",
                                fontWeight: "600",
                                margin: 0,
                                letterSpacing: "-0.2px",
                            }}>
                                {section.title}
                            </h2>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", marginBottom: "16px", fontFamily: "'Arial', sans-serif" }}>
                            {section.intro}
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            {section.items.map((item, i) => (
                                <li key={i} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    color: "rgba(255,255,255,0.8)",
                                    fontSize: "15px",
                                    fontFamily: "'Arial', sans-serif",
                                }}>
                                    <span style={{
                                        width: "6px", height: "6px",
                                        borderRadius: "50%",
                                        background: "#7eb8d4",
                                        flexShrink: 0,
                                    }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Smaller policy sections */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                    {[
                        {
                            icon: "🔒",
                            title: "Data Protection",
                            text: "We do not sell, rent, or share your personal information with third parties without your explicit permission.",
                        },
                        {
                            icon: "🍪",
                            title: "Cookies",
                            text: "Our website may use cookies to improve user experience and overall website performance during your visit.",
                        },
                    ].map((card, idx) => (
                        <div key={idx} style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "16px",
                            padding: "24px 26px",
                            backdropFilter: "blur(8px)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                <span style={{ fontSize: "18px" }}>{card.icon}</span>
                                <h2 style={{ color: "white", fontSize: "17px", fontWeight: "600", margin: 0 }}>{card.title}</h2>
                            </div>
                            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: "1.7", margin: 0, fontFamily: "'Arial', sans-serif" }}>
                                {card.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact section */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(126,184,212,0.12), rgba(74,154,190,0.08))",
                    border: "1px solid rgba(126,184,212,0.25)",
                    borderRadius: "16px",
                    padding: "32px",
                    backdropFilter: "blur(12px)",
                    textAlign: "center",
                }}>
                    <span style={{ fontSize: "28px", display: "block", marginBottom: "12px" }}>✉️</span>
                    <h2 style={{ color: "white", fontSize: "20px", fontWeight: "600", margin: "0 0 12px" }}>Contact Us</h2>
                    <p style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "15px",
                        lineHeight: "1.7",
                        margin: "0 auto",
                        maxWidth: "440px",
                        fontFamily: "'Arial', sans-serif",
                    }}>
                        If you have any questions regarding this Privacy Policy, please reach
                        out to us through our website. We are happy to assist you.
                    </p>
                </div>

            </main>
        </div>
    );
}