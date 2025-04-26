import BgImage from '../../assets/Background-image-for-spotly.jpg'

const Home = () => {
  return (
    <div>
      <img src={BgImage} alt="" className="absolute inset-0 w-full object-cover z-0" />
    </div>
  )
}

export default Home
