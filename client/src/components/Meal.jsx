/* eslint-disable react/prop-types */
import { MdDelete, MdEditDocument } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateMeals } from "../redux/user/userSlice";

export default function Meal({ props, setMeals, meals, setMeal, setToUpdate }) {
  const { text, calories, userId, _id, overflow } = props;
  const dispatch = useDispatch();

  const handleEdit = () => {
    const mealToEdit = meals.filter((m) => m._id === _id);
    setToUpdate(true);
    setMeal(mealToEdit[0]);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`api/meal/deletemeal/${_id}/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== _id));
        dispatch(updateMeals(meals));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`group relative w-full border border-teal-500  hover:border-2 h-[200px] overflow-hidden rounded-lg sm:w-[200px] ${
        overflow ? "bg-red-200" : "bg-green-200"
      } `}
    >
      <div className="p-3 flex flex-col gap-2 items-center ">
        <p className="text-lg font-semibold line-clamp-2">{`Meal: ${text}`}</p>
        <span className="italic text-sm">{`Calories: ${calories}`}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between text-2xl border">
        <MdEditDocument
          onClick={handleEdit}
          className="text-green-700 hover:text-green-500 cursor-pointer"
        />
        <MdDelete
          onClick={handleDelete}
          className=" text-red-700 hover:text-red-500 cursor-pointer "
        />
      </div>
    </div>
  );
}
