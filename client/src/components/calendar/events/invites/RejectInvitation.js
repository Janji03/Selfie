import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../services/axiosInstance";

const RejectInvitation = () => {
  const { id } = useParams();
  const userID = new URLSearchParams(window.location.search).get("userID");
  const navigate = useNavigate();

  useEffect(() => {
    const rejectInvitation = async () => {
      try {
        const response = await axiosInstance.put(
          `events/${id}/reject`,
          {},
          {
            params: {
              userID: userID,
            },
          }
        );

        if (response.status === 200) {
          alert("You have successfully rejected the invitation!");
        } else if (response.status === 403) {
          alert("You cannot modify your response. Please contact the host if changes are needed.");
          window.close();
        } else {
          alert("Error rejecting invitation.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while rejecting the invitation.");
      }
      window.close();
    };

    rejectInvitation();
  }, [id, userID, navigate]);

  return <div>Processing...</div>;
};

export default RejectInvitation;
