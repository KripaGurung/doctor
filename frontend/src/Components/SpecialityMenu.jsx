import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800" id="Speciality">
      <h1 className="text-3xl font-medium">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free!
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
        {specialityData.map((item, index) => (
          <Link onClick={()=>scrollTo(0,0)} key={index} to={`/doctors/${item.speciality}`}
            className="flex flex-col items-center text-sm cursor-pointer transition-all duration-500 hover:translate-y-[-5px]"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-blue-100 rounded-full">
              <img className="w-16 sm:w-20" src={item.image} alt={item.speciality} />
            </div>
            <p className="mt-2">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
