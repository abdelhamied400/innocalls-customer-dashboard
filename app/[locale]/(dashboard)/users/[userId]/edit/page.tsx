import usersService from "@/services/users.service";
import EditUserForm from "./form";

type EditUserProps = {
  params: Promise<{
    userId: string;
  }>;
};
const EditUser = async ({ params }: EditUserProps) => {
  const { userId } = await params;
  const initialUser = await usersService.getUserById(userId);

  return (
    <div className="page" id="edit-user">
      <EditUserForm
        initialUser={{
          id: userId,
          ...initialUser,
        }}
      />
    </div>
  );
};

export default EditUser;
