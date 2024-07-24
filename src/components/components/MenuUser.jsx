import { useNavigate } from "react-router-dom";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "../ui/dropdown-menu";

const MenuUser = () => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          navigate("/dashboard?tab=home");
        }}
      >
        Dashboard
        <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            navigate("/dashboard?tab=orders");
          }}
        >
          Orders
          <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate("/dashboard?tab=rentals");
          }}
        >
          Rentals
          <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate("/dashboard?tab=commercial-job");
          }}
        >
          Commercial Job Orders
          <DropdownMenuShortcut>⇧⌘JO</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
};

export default MenuUser;
