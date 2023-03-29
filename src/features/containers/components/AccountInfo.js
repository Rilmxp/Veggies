import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteUserAccount } from "../../../context/features/userSlice";
import { auth } from "../../../database/firebaseAuthentication";
import Modal from "../../ui/components/Modal";
import styles from "./AccountInfo.module.scss";

const AccountInfo = () => {
  const { user, errorMessage } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState("");

  useEffect(() => {
    if (errorMessage) {
      setShowErrorMsg(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (showErrorMsg) {
      setTimeout(() => setShowErrorMsg(""), 7000);
    }
  }, [showErrorMsg]);

  if (!user) return;

  function handleDeleteUserAccount(auth) {
    dispatch(deleteUserAccount(auth.currentUser))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        setShowErrorMsg(error);
      })
      // sets scrolling back to normal after closing the modal ("hidden" => "");
      .finally(() => (document.body.style.overflow = ""));
  }

  return (
    <article className={styles.textTableMagins}>
      <h1>Welcome {user && user.username},</h1>
      <p>
        This is your reserved area where you can manage your account and see all
        your favourites recipes.
      </p>
      <section>
        <h3>Account Information</h3>
        {showErrorMsg && (
          <p className={styles.deleteErrorMsg}>{errorMessage}</p>
        )}

        <table className={styles.tableStyles}>
          <tbody>
            <tr>
              <th>Username</th>
              <td>{user.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Manage</th>
              <td>
                <button onClick={() => setIsOpen(true)}>Delete Account</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <aside>
        <Modal
          isOpen={isOpen}
          handleDeleteUserAccount={() => handleDeleteUserAccount(auth)}
          close={() => setIsOpen(false)}
        />
      </aside>
    </article>
  );
};

export default AccountInfo;
