import { assets } from "../assets/assets"


const Footer = () => {
  return (
    <div className="md:mx-10">
        <div className="flex flex-col sm:flex-row justify-between gap-14 my-10 mt-40 text-sm">
            {/* ----- Left Section ----- */}
            <div>
                <img src= {assets.logo} alt='logo' className='mb-9 w-40'/>
                <p className="w-full md:w-2/3 text-gray-600 leading-6">At DoctorHub, we are dedicated to providing top-quality healthcare with ease and convenience. Schedule your doctor’s appointment today and experience
                    compassionate care from our expert medical team. Whether it’s a routine check-up or a specialized consultation, we are here to support your health journey. 
                    Book online for more details!</p>
                </div>
                {/* ----- Right Section ---- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>Doctors</li>
                        <li>My Appointments</li>
                        <li>Privacy policy</li>
                        </ul>
                </div>
                </div>
                {/* ----- Copyright Text ----- */}
                <div>
                    <hr />
                    <p className='py-5 text-sm text-center'>Copyright 2024@ DoctorHub All Right Reserved.</p>
                    </div>
                </div>
  )
}

export default Footer