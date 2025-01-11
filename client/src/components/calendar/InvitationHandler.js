import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const InvitationHandler = ({ action, type }) => {
  const { id } = useParams();
  const userID = new URLSearchParams(window.location.search).get("userID");
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        const response = await axiosInstance.put(
          `${type}/${id}/${action}`,
          {},
          {
            params: {
              userID: userID,
            },
          }
        );

        if (response.status === 200) {
          alert(
            `You have successfully ${action}ed the invitation!`
          );
        } else if (response.status === 403) {
          alert(
            "You cannot modify your response. Please contact the host if changes are needed."
          );
        } else {
          alert(`Error ${action}ing invitation.`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert(`An error occurred while ${action}ing the invitation.`);
      }
      window.close();
    };

    handleInvitation();
  }, [id, userID, navigate, type, action]);

  return <div>Processing...</div>;
};


export default InvitationHandler;