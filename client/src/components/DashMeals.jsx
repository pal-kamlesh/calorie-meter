import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashMeals() {
  const { currentUser } = useSelector((state) => state.user);
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mealIdToDelete, setMealIdToDelete] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`/api/meal/getmeals`);
        const data = await res.json();
        if (res.ok) {
          setMeals(data.meals);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchMeals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser._id]);

  const handleDeleteMeal = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/meal/deletemeal/${mealIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMeals((prev) =>
          prev.filter((comment) => comment._id !== mealIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && meals?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Calories</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {meals.map((meal) => (
              <Table.Body key={meal._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(meal.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{meal.text}</Table.Cell>
                  <Table.Cell>{meal.calories}</Table.Cell>
                  <Table.Cell>{meal.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setMealIdToDelete(meal._id);
                      }}
                      className="font-medium text-red-500 hover:underline hover:cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no Meal yet! </p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this?
            </h3>
            <div className=" flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteMeal}>
                Yes, I&rsquo;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
