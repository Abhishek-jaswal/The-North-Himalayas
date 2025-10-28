import React from 'react'
import Navbar from '../components/Navbar'
import TourPackageCard from '../components/TourPackageCard'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Packages() {
  return (
    <>
       <Navbar />
       <TourPackageCard/>
       <WhatsAppButton/>
       <Footer />
    </>
  )
}
