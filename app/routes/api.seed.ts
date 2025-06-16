import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { UserModel } from "~/models/user";

export const action: ActionFunction = async () => {
  try {
    // Kiểm tra xem đã có admin chưa
    const admin = await UserModel.findByEmail("admin@example.com");
    if (admin) {
      return json({ message: "Admin account already exists" });
    }

    // Tạo tài khoản admin mặc định
    const adminUser = await UserModel.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // Sẽ được hash tự động
      role: "admin",
    });

    return json({ 
      message: "Admin account created successfully",
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error("Error creating admin account:", error);
    return json({ error: "Failed to create admin account" }, { status: 500 });
  }
}; 