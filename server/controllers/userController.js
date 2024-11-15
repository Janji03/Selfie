import User from '../models/User.js';

// Funzione per prendere un utente tramite l'ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Funzione per aggiornare un utente tramite l'ID
export const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Aggiorna i campi
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.birthday = req.body.birthday || user.birthday;
    user.pronouns = req.body.pronouns || user.pronouns;
    user.sex = req.body.sex || user.sex;

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      birthday: updatedUser.birthday,
      pronouns: updatedUser.pronouns,
      sex: updatedUser.sex,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Funzione per aggiornare la foto profilo di un utente
export const updateUserPfpByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    if (req.file) {
      const uploadedFilePath = path.join('/uploads/', req.file.filename);
      user.profilePicture = uploadedFilePath;
    }
      
    const updatedUser = await user.save();
    
    res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Funzione per cancellare un utente tramite l'ID
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};