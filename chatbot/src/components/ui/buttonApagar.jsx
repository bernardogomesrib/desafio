import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";

const ButtonApagar = ({ id, setButtons }) => {
  const onclick = (id) => {
    fetch(`http://localhost:8000/chats/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetch("http://localhost:8000/chats")
          .then((response) => response.json())
          .then((data) => setButtons(data))
          .catch((error) => console.error("Error fetching buttons:", error));
      })
      .catch((error) => console.error("Error deleting chat:", error));
  };

  return (
    <Box onClick={() => onclick(id)}>
      <DeleteIcon />
    </Box>
  );
};
export { ButtonApagar };
