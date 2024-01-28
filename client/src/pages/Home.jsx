import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Meal from "../components/Meal";
import { updateMeals } from "../redux/user/userSlice";
import { Spinner } from "flowbite-react";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [toUpdate, setToUpdate] = useState(false);
  const [meals, setMeals] = useState(currentUser?.meals ?? []);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [meal, setMeal] = useState({
    text: "",
    calories: "",
  });
  const [caloriesCount, setCaloriesCount] = useState(0);

  useEffect(() => {
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    setCaloriesCount(totalCalories);
  }, [currentUser, meals]);

  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Initialize an empty object to store form data
    let obj = {};

    // Create a FormData object from the form
    const formData = new FormData(e.target);

    // Check if it's an update operation
    if (toUpdate) {
      // Find the meal to be updated in the existing meals array
      const desiredMeal = meals.find((m) => m._id === meal._id);

      // Check if updating the meal would exceed the daily calorie limit
      if (
        Number(caloriesCount) -
          Number(desiredMeal.calories) +
          Number(formData.get("calories")) >
        currentUser.caloriesPerDay
      ) {
        // If exceeding, set overflow to true in the object
        obj = {
          text: formData.get("text") ?? "",
          calories: formData.get("calories") ?? "",
          userId: currentUser._id,
          overflow: true,
        };
      } else {
        // If not exceeding, set overflow to false in the object
        obj = {
          text: formData.get("text") ?? "",
          calories: formData.get("calories") ?? "",
          userId: currentUser._id,
          overflow: false,
        };
      }
    } else {
      // Check if creating a new meal would exceed the daily calorie limit
      if (
        Number(caloriesCount) + Number(formData.get("calories")) >
        currentUser.caloriesPerDay
      ) {
        // If exceeding, set overflow to true in the object
        obj = {
          text: formData.get("text") ?? "",
          calories: formData.get("calories") ?? "",
          userId: currentUser._id,
          overflow: true,
        };
      } else {
        // If not exceeding, set overflow to false in the object
        obj = {
          text: formData.get("text") ?? "",
          calories: formData.get("calories") ?? "",
          userId: currentUser._id,
          overflow: false,
        };
      }
    }

    // Check if it's an update operation
    if (toUpdate) {
      try {
        // Set loading state to true
        setLoading(true);

        // Make a PUT request to update the meal
        const res = await fetch(
          `api/meal/updatemeal/${meal._id}/${meal.userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
          }
        );

        // Parse the response JSON
        const data = await res.json();

        // Check if the response is not okay
        if (!res.ok) {
          console.log(data.message);
          setLoading(false);
        } else {
          // Update local state and dispatch Redux action on success
          setMeals(data);
          dispatch(updateMeals(data));
          // Reset form and update state variables
          setMeal(() => ({ text: "", calories: "" }));
          setToUpdate(false);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      try {
        // Set loading state to true
        setLoading(true);

        // Make a POST request to create a new meal
        const res = await fetch(`/api/meal/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        });

        // Parse the response JSON
        const data = await res.json();

        // Check if the response is not okay
        if (!res.ok) {
          console.log(data.message);
          setLoading(false);
        } else {
          // Update local state and dispatch Redux action on success
          dispatch(updateMeals(data));
          setMeals(data);
          // Reset form and update state variables
          setMeal(() => ({ text: "", calories: "" }));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setMeal((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="my-3 mx-auto w-11/12">
      <form
        className="mb-10 flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-200 p-10 shadow-lg  md:flex-row"
        onSubmit={handleSubmit}
      >
        <label htmlFor="location">
          Text
          <input
            value={meal.text}
            type="text"
            id="text"
            name="text"
            placeholder="name"
            className="serarch-input m-2"
            onChange={handleChange}
          />
        </label>

        <label htmlFor="calories">
          Calories
          <input
            value={meal.calories}
            type="number"
            id="calories"
            name="calories"
            placeholder="calories"
            onChange={handleChange}
            className="serarch-input m-2"
          ></input>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="color rounded border-none bg-purple-500 px-6 py-2 text-white hover:opacity-50"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className=" pl-3">Loading...</span>
            </>
          ) : toUpdate ? (
            "Update"
          ) : (
            "Add"
          )}
        </button>
      </form>
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-center">
        {`Calories Target: ${currentUser.caloriesPerDay} | Current Total: ${caloriesCount}`}
      </div>

      {meals.length < 1 ? (
        <div className="max-w-6xl mx-auto p-3 flex items-center justify-center">
          <h4>You have not added any meal today!</h4>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-3 flex flex-row flex-wrap gap-8 py-7">
          {meals.map((m) => (
            <Meal
              key={m._id}
              props={m}
              setMeals={setMeals}
              meals={meals}
              setMeal={setMeal}
              setToUpdate={setToUpdate}
              setCaloriesCount={setCaloriesCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
