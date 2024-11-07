import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="relative w-full pt-20 pb-10">
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center relative z-10">
        <p className=" mx-5 md:text-base text-sm md:font-normal font-light text-white">
          Have a nice day!
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          <a
            href="https://www.linkedin.com/in/ardamutlu7/"
            target="_blank"
            rel="noopener noreferrer"
            className=" flex items-center justify-center w-10 h-10 cursor-pointer bg-opacity-75 bg-black text-white rounded-lg border border-gray-300  my-15 mx-8"
            style={{ position: "relative", zIndex: 20 }}
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
