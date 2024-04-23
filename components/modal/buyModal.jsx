import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { buyModalHide } from "../../redux/counterSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BuyModal = ( {tournamentUuid} ) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { buyModal } = useSelector((state) => state.counter);
  const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

  const handleDelete = async () => {
    // Show loading indicator
    setIsLoading(true);

    console.log("Delete", tournamentUuid)

    try {
      // Perform delete request using Axios
      const response = await axios.delete(`${backendUrl}/api/tournaments/leave/${tournamentUuid}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Hide modal on success
        dispatch(buyModalHide());
        // Show success toast
        toast.success('Tournament deleted successfully');
      } else {
        throw new Error('Failed to delete tournament');
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      // Show error toast
      toast.error('Failed to delete tournament');
    } finally {
      // Hide loading indicator
      setIsLoading(false);
    }
  };


  return (
    <div>
      {/* <!-- Buy Now Modal --> */}
      <div className={buyModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="buyNowModalLabel">
                Confirm Delete
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(buyModalHide())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>

            {/* <!-- Body --> */}
            <div className="modal-body p-6">

              {/* <!-- Terms --> */}
              <div className="mt-4 flex items-center space-x-2">
                <label
                  htmlFor="buyNowTerms"
                  className="dark:text-jacarta-200 text-sm"
                >
                  Are you sure you want to delete {"Xhibiter's"}{" "}
                </label>
              </div>
            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <button
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-half rounded-half py-3 px-5 text-center font-small text-white transition-all"
                onClick={handleDelete}
                disabled={isLoading}
              >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
