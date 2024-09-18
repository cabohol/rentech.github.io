import { supabase, doLogout } from "../name";

const itemsImageUrl =
  "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";
// Get user ID from localStorage
let userId = localStorage.getItem("user_id");

console.log(userId); // I-print ang userId para sa debugging purposes

document.addEventListener('DOMContentLoaded', async function () {
    // Check if userId exists
    if (userId) {
        // Fetch the user's details from Supabase
        let { data: userDetails, error } = await supabase
            .from("userinformation")
            .select("*")
            .eq("id", userId)
            .single();

        if (userDetails) {
            document.getElementById("first_name").textContent = userDetails.first_name + " " + userDetails.last_name;
            document.getElementById("contact_number").textContent = "Contact #: " + userDetails.contact_number;
            document.getElementById("college_name").textContent = "College: " + userDetails.college_name;

            // Set the profile picture if it exists
            if (userDetails.image_path) {
                document.querySelector(".profile-pic-container img").src = userDetails.image_path;
                localStorage.setItem("profilePic", userDetails.image_path);
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const profilePicInput = document.getElementById("profilePicInput");
    const profilePic = document.querySelector(".profile-pic-container img");
    const profButton = document.getElementById("profbutton");

    profButton.addEventListener("click", function () {
        profilePicInput.click(); 
    });

    profilePicInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            profilePic.src = e.target.result;

            // I-save ang base64 string ng larawan sa localStorage
            localStorage.setItem("profilePic", e.target.result);

            // I-save usab ang base64 string sa server o database
            saveProfilePicToServer(file);
        };

        reader.readAsDataURL(file);
    });

    // Kapag ang page ay nag-reload o nag-refresh, i-set ang larawan mula sa localStorage
    window.addEventListener("load", function () {
        const savedProfilePic = localStorage.getItem("profilePic");
        if (savedProfilePic) {
            profilePic.src = savedProfilePic;
        }
    });
});

document.body.addEventListener("click", function (event) {
    if (event.target.id === "logout_btn") {
        localStorage.removeItem("profilePic"); // Clear ang larawan sa localStorage
        doLogout();
    }
});

async function saveProfilePicToServer(file) {
    try {
        // Generate a unique filename
        const fileName = `${userId}/profile_pic_${Date.now()}.png`;

        // Upload the image to Supabase Storage
        const { data, error } = await supabase.storage
            .from("laptops")
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Get the public URL of the uploaded image
        const imageUrl = `${itemsImageUrl}${fileName}`;

        // Update the user's profile picture URL in the Supabase database
        const { error: updateError } = await supabase
            .from("userinformation")
            .update({ image_path: imageUrl })
            .eq("id", userId);

        if (updateError) {
            throw updateError;
        }

        // Update the localStorage with the new image path
        localStorage.setItem("profilePic", imageUrl);

    } catch (error) {
        console.error("Error saving profile picture:", error);
    }
}
