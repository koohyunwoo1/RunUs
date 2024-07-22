import "../../styles/Common/Button2.css"

const Button2 = ({ src }) => {
  return (
    <button className="Button2">
      <img src={src} className="Button_image" />
    </button>
  )
}

export default Button2