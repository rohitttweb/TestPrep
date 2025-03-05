import React from "react";

const ProfileImage = ({ name }) => {
    const nameParts = name.trim().split(/\s+/); // Handles extra spaces
    const firstNameInitial = nameParts[0] ? nameParts[0][0].toUpperCase() : "";
    const lastNameInitial = nameParts[1] ? nameParts[1][0].toUpperCase() : "";

    return (

        <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-lg">
                    {firstNameInitial}
                    {lastNameInitial}
                </span>
            </div>
        </div>

    );
};

export default ProfileImage;
