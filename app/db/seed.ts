import { UserModel } from "~/models/user";

async function seed() {
  try {
    const admin = await UserModel.findByEmail("admin@example.com");
    if (admin) {
      console.log("Admin account already exists");
      return;
    }
    
    const adminUser = await UserModel.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // Sẽ được hash tự động
      role: "admin",
    });

    console.log("Admin account created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}

seed(); 