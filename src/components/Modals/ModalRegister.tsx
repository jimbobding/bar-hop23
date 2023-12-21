import { faHippo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface LogoutMessageProps {
  modal: boolean;
  toggleModal: () => void;
}
interface UserData {
  f_name: string;
  l_name: string;
}
const ModalRegister: React.FC<LogoutMessageProps> = ({
  modal,
  toggleModal,
}) => {
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  //JWT data persist
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userData, setUserData] = useState<UserData>({
    f_name: "",
    l_name: "",
  });
  const getUserDataFromLocalStorage = () => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  };
  useEffect(() => {
    getUserDataFromLocalStorage();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {modal && (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              <h1>
                {" "}
                Hello
                <hr />
              </h1>
              <p>You have successfully registered</p>
              <button
                className="modal-btn"
                onClick={() => {
                  toggleModal();
                  const { from } = location.state || {
                    from: { pathname: "/" },
                  };
                  navigate(from);
                }}
              >
                Close
              </button>
              <FontAwesomeIcon
                className="fa-icon fa-hippo modal-hippo"
                icon={faHippo}
              />{" "}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ModalRegister;
