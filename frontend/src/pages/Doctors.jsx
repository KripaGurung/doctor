import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const specialities = [
  "General Physician",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Gastroenterologist",
  "Pediatricians"
];

const Doctors = () => {
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  useEffect(() => {
    if (selectedSpecialities.length > 0) {
      setFilterDoc(doctors.filter(doc => selectedSpecialities.includes(doc.speciality)));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, selectedSpecialities]);

  const handleCheckboxChange = (speciality) => {
    setSelectedSpecialities(prev =>
      prev.includes(speciality)
        ? prev.filter(item => item !== speciality)
        : [...prev, speciality]
    );
  };

  return (
    <div className="mx-4 sm:mx-[10%] my-10">
      <p className="text-gray-600 text-sm mb-2">Review the different doctors specialists.</p>
      <div className="flex flex-col sm:flex-row items-start gap-10">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {specialities.map(speciality => (
            <label key={speciality} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedSpecialities.includes(speciality)}
                onChange={() => handleCheckboxChange(speciality)}
                className="accent-indigo-500"
              />
              {speciality}
            </label>
          ))}
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4 sm:mt-0">
          {filterDoc.map((item, index) => (
            <div key={index} onClick={() => navigate(`/appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
              <img className="bg-blue-50 w-full h-48 object-cover" src={item.image} alt={item.name} />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;