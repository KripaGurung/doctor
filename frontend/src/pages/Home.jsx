import Header from "../Components/Header"
import SpecialityMenu from "../Components/SpecialityMenu"
import TopDoctors from "../Components/TopDoctors"
import TopFeatureDoctors from "../Components/TopFeatureDoctors"

const Home = () => {
  return (
    <div>
        <Header/>
        <SpecialityMenu/>
        <TopDoctors/>
        <TopFeatureDoctors/>
    </div>
  )
}

export default Home