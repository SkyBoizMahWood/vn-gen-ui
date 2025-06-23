import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { UserModel } from "~/models/user";

export const loader: LoaderFunction = async () => {
  // Kiểm tra xem đã có admin chưa
  const admin = await UserModel.findByEmail("admin@example.com");
  if (admin) {
    return json({ message: "Admin account already exists" });
  }
  return null;
};

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
      password: "admin123",
      role: "admin",
    });

    return json({ 
      success: true,
      message: "Admin account created successfully",
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error("Error creating admin account:", error);
    return json({ 
      success: false,
      error: "Failed to create admin account" 
    }, { status: 500 });
  }
};

export default function SetupPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Setup Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create the default admin account
          </p>
        </div>

        {actionData?.success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  {actionData.message}
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Email: {actionData.user.email}</p>
                  <p>Password: admin123</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {actionData?.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {actionData.error}
                </h3>
              </div>
            </div>
          </div>
        )}

        <Form method="post" className="mt-8 space-y-6">
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Admin Account
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
} 