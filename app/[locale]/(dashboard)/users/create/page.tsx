import usersService from "@/services/users.service";
import CreateUserForm from "./form";

const CreateUser = async () => {
  const initialExt = await usersService.getRecommendedNumber();
  const initialPin = (Math.floor(Math.random() * 10000) + 1)
    .toString()
    .padStart(4, "0"); //

  return (
    <div className="page" id="create-user">
      <CreateUserForm ext={initialExt} pin={initialPin} />
    </div>
  );
};

export default CreateUser;
