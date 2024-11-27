import Credentials from "next-auth/providers/credentials";

const CredentialsProvider = Credentials({
  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  // e.g. domain, username, password, 2FA token, etc.
  credentials: {
    email: {},
    password: {},
  },
  authorize: async (credentials) => {
    const user = {
      id: "1",
      name: "John Doe",
      email: credentials.email as string,
    };

    if (!user) {
      // No user found, so this is their first attempt to login
      // Optionally, this is also the place you could do a user registration
      throw new Error("Invalid credentials.");
    }

    console.log("User found", user);

    // return user object with their profile data
    return {
      ...user,
      role: "user",
    };
  },
});

export default CredentialsProvider;
