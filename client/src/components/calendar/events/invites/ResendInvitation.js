import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../services/axiosInstance";

const ResendInvitation = () => {
  const { id } = useParams();
  const userID = new URLSearchParams(window.location.search).get("userID");
  const navigate = useNavigate();

  useEffect(() => {
    const resendInvitation = async () => {
      try {
        const response = await axiosInstance.put(
          `events/${id}/resend`,
          {},
          {
            params: {
              userID: userID,
            },
          }
        );

        if (response.status === 200) {
          alert("You have successfully rescheduled the invitation!");
        } else {
          alert("Error rescheduling invitation.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while rescheduling the invitation.");
      }
      window.close();
    };

    resendInvitation();
  }, [id, userID, navigate]);

  return <div>Processing...</div>;
};

export default ResendInvitation;
